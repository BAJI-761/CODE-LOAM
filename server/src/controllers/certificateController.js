const { v4: uuidv4 } = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');
const crypto = require('crypto');

// Helper function for atomic generation
exports.generateCertificateForCourse = async (studentId, courseId) => {
  // Check enrollment is completed
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    status: 'completed',
  }).populate('course', 'title');

  if (!enrollment) return null;

  // Check if certificate already exists
  let certificate = await Certificate.findOne({ student: studentId, course: courseId });
  if (certificate) return certificate;

  // Calculate grade based on quiz scores
  const quizzes = await Quiz.find({ course: courseId });
  let grade = 'C';
  if (quizzes.length > 0) {
    const quizIds = quizzes.map((q) => q._id);
    const attempts = await QuizAttempt.find({
      student: studentId,
      quiz: { $in: quizIds },
    });

    if (attempts.length > 0) {
      const avgScore = Math.round(
        attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / attempts.length
      );
      if (avgScore >= 90) grade = 'A';
      else if (avgScore >= 75) grade = 'B';
      else grade = 'C';
    }
  }

  certificate = await Certificate.create({
    student: studentId,
    course: courseId,
    certificateId: crypto.randomUUID(),
    grade,
    completionPercentage: enrollment.completionPercentage,
  });

  return certificate;
};

// POST /api/v1/certificates/generate/:courseId (Student)
exports.generateCertificate = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const certificate = await exports.generateCertificateForCourse(req.user._id, courseId);
  
  if (!certificate) {
    throw new ApiError(400, 'Course must be completed to generate a certificate');
  }

  res.status(201).json(new ApiResponse(201, certificate, 'Certificate generated/fetched'));
});

// GET /api/v1/certificates/:id (Student)
exports.getCertificateById = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({ _id: req.params.id, student: req.user._id })
    .populate('course', 'title')
    .populate('student', 'name email');

  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }

  res.json(new ApiResponse(200, certificate, 'Certificate fetched'));
});

// GET /api/v1/certificates (Student)
exports.getCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id })
    .populate('course', 'title thumbnail category')
    .populate('student', 'name email')
    .sort({ issuedAt: -1 });

  res.json(new ApiResponse(200, certificates, 'Certificates fetched'));
});

// GET /api/v1/certificates/verify/:id (Public)
exports.verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({ certificateId: req.params.id })
    .populate('student', 'name email')
    .populate('course', 'title category difficulty');

  if (!certificate) {
    throw new ApiError(404, 'Certificate not found or invalid');
  }

  res.json(new ApiResponse(200, certificate, 'Certificate verified'));
});
