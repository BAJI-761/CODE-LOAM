const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Enrollment = require('../models/Enrollment');
const CodeSubmission = require('../models/CodeSubmission');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');

// GET /api/v1/progress/overview
exports.getOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [enrollments, challengeStats, quizAttempts] = await Promise.all([
    Enrollment.find({ student: userId }).populate('course', 'title thumbnail totalLessons'),
    CodeSubmission.aggregate([
      { $match: { student: userId } },
      { $group: {
        _id: '$challenge',
        bestStatus: { $first: '$status' },
        attempts: { $sum: 1 },
      }},
    ]),
    QuizAttempt.find({ student: userId }).sort({ attemptedAt: -1 }).limit(20),
  ]);

  const coursesEnrolled = enrollments.length;
  const coursesCompleted = enrollments.filter((e) => e.status === 'completed').length;
  const challengesSolved = challengeStats.filter((c) => c.bestStatus === 'accepted').length;
  const challengesAttempted = challengeStats.length;
  const quizzesTaken = quizAttempts.length;
  const quizzesPassed = quizAttempts.filter((q) => q.passed).length;

  // Calculate average quiz score
  const avgQuizScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((sum, q) => sum + (q.percentage || 0), 0) / quizAttempts.length)
    : 0;

  res.json(new ApiResponse(200, {
    coursesEnrolled,
    coursesCompleted,
    challengesSolved,
    challengesAttempted,
    quizzesTaken,
    quizzesPassed,
    avgQuizScore,
    streak: req.user.streak || 0,
    totalPoints: req.user.totalPoints || 0,
    enrollments: enrollments.map((e) => ({
      course: e.course,
      completionPercentage: e.completionPercentage,
      status: e.status,
    })),
  }, 'Progress overview fetched'));
});

// GET /api/v1/progress/course/:courseId
exports.getCourseProgress = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });

  if (!enrollment) throw new ApiError(404, 'Enrollment not found');

  res.json(new ApiResponse(200, {
    completedLessons: enrollment.completedLessons,
    completionPercentage: enrollment.completionPercentage,
    lastAccessedModule: enrollment.lastAccessedModule,
    lastAccessedLesson: enrollment.lastAccessedLesson,
    status: enrollment.status,
  }, 'Course progress fetched'));
});

// GET /api/v1/progress/challenges
exports.getChallengeProgress = asyncHandler(async (req, res) => {
  const submissions = await CodeSubmission.find({ student: req.user._id })
    .populate('challenge', 'title difficulty category points')
    .sort({ createdAt: -1 });

  // Group by challenge
  const challengeMap = new Map();
  for (const sub of submissions) {
    const id = sub.challenge?._id?.toString();
    if (!id) continue;
    if (!challengeMap.has(id)) {
      challengeMap.set(id, {
        challenge: sub.challenge,
        bestStatus: sub.status,
        attempts: 1,
        lastAttempt: sub.createdAt,
      });
    } else {
      const existing = challengeMap.get(id);
      existing.attempts++;
      if (sub.status === 'accepted') existing.bestStatus = 'accepted';
    }
  }

  const challenges = Array.from(challengeMap.values());
  const byDifficulty = {
    easy: { solved: 0, attempted: 0 },
    medium: { solved: 0, attempted: 0 },
    hard: { solved: 0, attempted: 0 },
  };

  for (const c of challenges) {
    const diff = c.challenge?.difficulty;
    if (diff && byDifficulty[diff]) {
      byDifficulty[diff].attempted++;
      if (c.bestStatus === 'accepted') byDifficulty[diff].solved++;
    }
  }

  res.json(new ApiResponse(200, {
    total: challenges.length,
    solved: challenges.filter((c) => c.bestStatus === 'accepted').length,
    byDifficulty,
    recentChallenges: challenges.slice(0, 10),
  }, 'Challenge progress fetched'));
});
