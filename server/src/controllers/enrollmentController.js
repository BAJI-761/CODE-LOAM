const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Enrollment = require('../models/Enrollment');

// POST /api/v1/enrollments/:courseId (Student)
exports.enrollInCourse = asyncHandler(async (req, res) => {
  // This is handled in courseController.enrollInCourse
  // Keeping this route available for explicit enrollment endpoint
  const Course = require('../models/Course');
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (existing) throw new ApiError(400, 'Already enrolled');

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
  });

  await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

  res.status(201).json(new ApiResponse(201, enrollment, 'Enrolled successfully'));
});

// GET /api/v1/enrollments/my-courses (Student)
exports.getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate('course', 'title thumbnail category difficulty instructor totalLessons totalDuration')
    .sort({ lastAccessedAt: -1 });

  // Populate instructor name within course
  await Enrollment.populate(enrollments, {
    path: 'course.instructor',
    select: 'name avatar',
  });

  res.json(new ApiResponse(200, enrollments, 'Enrollments fetched'));
});

// GET /api/v1/enrollments/check/:courseId (Student)
exports.checkEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });

  res.json(new ApiResponse(200, {
    enrolled: !!enrollment,
    enrollment: enrollment || null,
  }, 'Enrollment status checked'));
});
