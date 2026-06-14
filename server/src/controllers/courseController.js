const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Quiz = require('../models/Quiz');
const CodingChallenge = require('../models/CodingChallenge');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const certificateController = require('./certificateController');

// GET /api/v1/courses?search=&category=&difficulty=&page=&limit=
exports.listCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, difficulty } = req.query;
  const q = { isPublished: true };
  if (search) q.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
  if (category) q.category = category;
  if (difficulty) q.difficulty = difficulty;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Course.countDocuments(q);
  const items = await Course.find(q)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('instructor', 'name avatar');

  res.json(new ApiResponse(200, { items, total, page: Number(page), limit: Number(limit) }, 'Courses fetched'));
});

// GET /api/v1/courses/:id
exports.getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate('instructor', 'name avatar bio');
  if (!course) throw new ApiError(404, 'Course not found');
  res.json(new ApiResponse(200, course, 'Course fetched'));
});

// POST /api/v1/courses/:id/enroll (Student)
exports.enrollInCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');

  // Check if already enrolled
  const existing = await Enrollment.findOne({ student: req.user._id, course: id });
  if (existing) throw new ApiError(400, 'Already enrolled in this course');

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: id,
  });

  // Increment enrollment count
  await Course.findByIdAndUpdate(id, { $inc: { enrollmentCount: 1 } });

  res.status(201).json(new ApiResponse(201, enrollment, 'Enrolled successfully'));
});

// GET /api/v1/courses/:id/learn (Student)
exports.getCourseForLearning = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enrollment = await Enrollment.findOne({ course: id, student: req.user._id });
  if (!enrollment) throw new ApiError(403, 'Not enrolled in this course');

  const course = await Course.findById(id).populate('instructor', 'name avatar');
  res.json(new ApiResponse(200, {
    course,
    enrollment: {
      completedLessons: enrollment.completedLessons,
      completionPercentage: enrollment.completionPercentage,
      lastAccessedModule: enrollment.lastAccessedModule,
      lastAccessedLesson: enrollment.lastAccessedLesson,
      status: enrollment.status,
    },
  }, 'Course learning payload'));
});

// PUT /api/v1/courses/:id/progress { lessonId, completed }
exports.updateProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { lessonId, completed } = req.body;

  const enrollment = await Enrollment.findOne({ course: id, student: req.user._id });
  if (!enrollment) throw new ApiError(404, 'Enrollment not found');

  // Check if already completed
  const alreadyCompleted = enrollment.completedLessons.includes(lessonId);

  if (completed && !alreadyCompleted) {
    enrollment.completedLessons.push(lessonId);
  } else if (!completed && alreadyCompleted) {
    enrollment.completedLessons = enrollment.completedLessons.filter(lid => lid.toString() !== lessonId.toString());
  }

  enrollment.lastAccessedAt = new Date();

  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');

  // Find module/lesson indices
  let foundModuleIndex = 0;
  let foundLessonIndex = 0;
  course.modules.forEach((mod, mIdx) => {
    mod.lessons.forEach((les, lIdx) => {
      if (les._id.toString() === lessonId.toString()) {
        foundModuleIndex = mIdx;
        foundLessonIndex = lIdx;
      }
    });
  });

  enrollment.lastAccessedModule = foundModuleIndex;
  enrollment.lastAccessedLesson = foundLessonIndex;

  // Calculate completion percentage
  const totalLessons = course.totalLessons || course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  if (totalLessons > 0) {
    enrollment.completionPercentage = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
  }

  // Check if completed
  let isNewlyCompleted = false;
  if (enrollment.completionPercentage >= 100 && enrollment.status !== 'completed') {
    enrollment.status = 'completed';
    enrollment.completedAt = new Date();
    isNewlyCompleted = true;
  } else if (enrollment.completionPercentage < 100 && enrollment.status === 'completed') {
    enrollment.status = 'active';
    enrollment.completedAt = null;
  }

  await enrollment.save();

  let certificate = null;
  if (isNewlyCompleted) {
    certificate = await certificateController.generateCertificateForCourse(req.user._id, id);
  }

  res.json(new ApiResponse(200, {
    completedLessons: enrollment.completedLessons.length,
    completionPercentage: enrollment.completionPercentage,
    status: enrollment.status,
    isNewlyCompleted,
    certificate
  }, 'Progress updated'));
});

// ─── INSTRUCTOR ROUTES ───────────────────────────────────────

// GET /api/v1/instructor/dashboard/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  // Total Courses
  const courses = await Course.find({ instructor: instructorId });
  const courseIds = courses.map(c => c._id);
  const totalCourses = courses.length;

  // Enrollments
  const enrollments = await Enrollment.find({ course: { $in: courseIds } });
  const totalStudents = enrollments.length;
  const avgCompletion = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) / enrollments.length)
    : 0;

  // Quizzes & Challenges
  const totalQuizzes = await Quiz.countDocuments({ createdBy: instructorId });
  const totalChallenges = await CodingChallenge.countDocuments({ createdBy: instructorId });

  res.json(new ApiResponse(200, {
    totalCourses,
    totalStudents,
    avgCompletion,
    totalContent: totalQuizzes + totalChallenges,
  }, 'Instructor dashboard stats fetched'));
});

// POST /api/v1/instructor/courses
exports.createCourse = asyncHandler(async (req, res) => {
  const body = req.body;
  body.instructor = req.user._id;
  const course = await Course.create(body);
  res.status(201).json(new ApiResponse(201, course, 'Course created'));
});

// PUT /api/v1/instructor/courses/:id
exports.updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(req.user._id)) throw new ApiError(403, 'Not authorized');
  Object.assign(course, req.body);
  await course.save();
  res.json(new ApiResponse(200, course, 'Course updated'));
});

// DELETE /api/v1/instructor/courses/:id
exports.deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(req.user._id)) throw new ApiError(403, 'Not authorized');
  await Course.findByIdAndDelete(id);
  res.json(new ApiResponse(200, null, 'Course deleted'));
});

// POST /api/v1/instructor/courses/:id/modules
exports.addModule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(req.user._id)) throw new ApiError(403, 'Not authorized');

  const moduleData = {
    title: req.body.title,
    order: req.body.order || (course.modules.length + 1),
    lessons: [],
  };
  course.modules.push(moduleData);
  await course.save();
  res.status(201).json(new ApiResponse(201, course, 'Module added'));
});

// PUT /api/v1/instructor/courses/:id/modules/:moduleIndex
exports.updateModule = asyncHandler(async (req, res) => {
  const { id, moduleIndex } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(req.user._id)) throw new ApiError(403, 'Not authorized');

  const mod = course.modules[parseInt(moduleIndex, 10)];
  if (!mod) throw new ApiError(404, 'Module not found');
  if (req.body.title) mod.title = req.body.title;
  if (req.body.order !== undefined) mod.order = req.body.order;
  await course.save();
  res.json(new ApiResponse(200, course, 'Module updated'));
});

// POST /api/v1/instructor/courses/:id/modules/:moduleIndex/lessons
exports.addLesson = asyncHandler(async (req, res) => {
  const { id, moduleIndex } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(req.user._id)) throw new ApiError(403, 'Not authorized');

  const mod = course.modules[parseInt(moduleIndex, 10)];
  if (!mod) throw new ApiError(404, 'Module not found');

  const lesson = {
    title: req.body.title,
    type: req.body.type || 'video',
    videoUrl: req.body.videoUrl,
    content: req.body.content,
    resources: req.body.resources || [],
    duration: req.body.duration || 0,
    order: req.body.order || (mod.lessons.length + 1),
  };
  mod.lessons.push(lesson);
  await course.save();
  res.status(201).json(new ApiResponse(201, course, 'Lesson added'));
});

// GET /api/v1/instructor/courses — list instructor's courses
exports.listInstructorCourses = asyncHandler(async (req, res) => {
  const items = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, items, 'Instructor courses fetched'));
});

// GET /api/v1/instructor/courses/:id/analytics
exports.getCourseAnalytics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(req.user._id)) throw new ApiError(403, 'Not authorized');

  const enrollments = await Enrollment.find({ course: id });
  const completed = enrollments.filter((e) => e.status === 'completed').length;
  const active = enrollments.filter((e) => e.status === 'active').length;
  const dropped = enrollments.filter((e) => e.status === 'dropped').length;
  const avgCompletion = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) / enrollments.length)
    : 0;

  res.json(new ApiResponse(200, {
    totalEnrollments: enrollments.length,
    completed,
    active,
    dropped,
    avgCompletion,
  }, 'Course analytics fetched'));
});

// GET /api/v1/instructor/students — all students across instructor's courses
exports.getInstructorStudents = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).select('_id title');
  const courseIds = courses.map((c) => c._id);

  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate('student', 'name email avatar')
    .populate('course', 'title');

  res.json(new ApiResponse(200, enrollments, 'Students fetched'));
});

// DELETE /api/v1/instructor/courses/:id/modules/:moduleIndex
exports.removeModule = asyncHandler(async (req, res) => {
  const { id, moduleIndex } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(req.user._id)) throw new ApiError(403, 'Not authorized');

  course.modules.splice(parseInt(moduleIndex, 10), 1);
  await course.save();
  res.json(new ApiResponse(200, course, 'Module removed'));
});

// DELETE /api/v1/instructor/courses/:id/modules/:moduleIndex/lessons/:lessonIndex
exports.removeLesson = asyncHandler(async (req, res) => {
  const { id, moduleIndex, lessonIndex } = req.params;
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(req.user._id)) throw new ApiError(403, 'Not authorized');

  const mod = course.modules[parseInt(moduleIndex, 10)];
  if (!mod) throw new ApiError(404, 'Module not found');

  mod.lessons.splice(parseInt(lessonIndex, 10), 1);
  await course.save();
  res.json(new ApiResponse(200, course, 'Lesson removed'));
});
