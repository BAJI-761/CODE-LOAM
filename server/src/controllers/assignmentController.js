const asyncHandler = require('../utils/asyncHandler');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// GET /api/v1/assignments/course/:courseId
exports.getAssignmentsByCourse = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ course: req.params.courseId }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, assignments, 'Assignments fetched'));
});

// POST /api/v1/assignments (Instructor)
exports.createAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json(new ApiResponse(201, assignment, 'Assignment created'));
});

// POST /api/v1/assignments/:id/submit (Student)
exports.submitAssignment = asyncHandler(async (req, res) => {
  const { content, fileUrl } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) throw new ApiError(404, 'Assignment not found');

  const submission = await AssignmentSubmission.create({
    student: req.user._id,
    assignment: assignment._id,
    content,
    fileUrl,
  });

  res.status(201).json(new ApiResponse(201, submission, 'Assignment submitted'));
});
