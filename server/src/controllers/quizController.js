const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const aiService = require('../services/aiService');

// POST /api/v1/quizzes (Instructor)
exports.createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json(new ApiResponse(201, quiz, 'Quiz created'));
});

// PUT /api/v1/quizzes/:id (Instructor)
exports.updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (!quiz.createdBy.equals(req.user._id)) throw new ApiError(403, 'Not authorized');

  Object.assign(quiz, req.body);
  await quiz.save();
  res.json(new ApiResponse(200, quiz, 'Quiz updated'));
});

// DELETE /api/v1/quizzes/:id (Instructor)
exports.deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (!quiz.createdBy.equals(req.user._id)) throw new ApiError(403, 'Not authorized');

  await Quiz.findByIdAndDelete(req.params.id);
  res.json(new ApiResponse(200, null, 'Quiz deleted'));
});

// POST /api/v1/quizzes/ai-generate (Instructor)
exports.aiGenerateQuiz = asyncHandler(async (req, res) => {
  const { topic, difficulty, count } = req.body;
  if (!topic || !difficulty || !count) {
    throw new ApiError(400, 'topic, difficulty, and count are required');
  }

  const questions = await aiService.generateQuiz(topic, difficulty, count);
  res.json(new ApiResponse(200, { questions }, 'Quiz questions generated'));
});

// GET /api/v1/quizzes/:id (Student — sans correct answers)
exports.getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  // Strip correct answers for student view
  const sanitized = quiz.toObject();
  sanitized.questions = sanitized.questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options,
    points: q.points,
    // correctAnswer and explanation hidden until after attempt
  }));

  res.json(new ApiResponse(200, sanitized, 'Quiz fetched'));
});

// POST /api/v1/quizzes/:id/attempt (Student)
exports.submitAttempt = asyncHandler(async (req, res) => {
  const { answers, timeTaken } = req.body;
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  // Score the attempt
  let score = 0;
  const totalPoints = quiz.totalPoints || quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);

  for (const ans of answers) {
    const question = quiz.questions[ans.questionIndex];
    if (question && question.correctAnswer === ans.selectedOption) {
      score += question.points || 10;
    }
  }

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const passed = percentage >= (quiz.passingScore || 60);

  const attempt = await QuizAttempt.create({
    student: req.user._id,
    quiz: quiz._id,
    answers,
    score,
    totalPoints,
    percentage,
    timeTaken,
    passed,
  });

  res.status(201).json(new ApiResponse(201, attempt, 'Attempt submitted'));
});

// GET /api/v1/quizzes/:id/results (Student)
exports.getResults = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({
    student: req.user._id,
    quiz: req.params.id,
  }).sort({ attemptedAt: -1 });

  // Include correct answers now that student has attempted
  const quiz = await Quiz.findById(req.params.id);

  res.json(new ApiResponse(200, { attempts, quiz }, 'Results fetched'));
});

// GET /api/v1/quizzes/course/:courseId (Student)
exports.getQuizzesByCourse = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId })
    .select('title timeLimit passingScore totalPoints questions')
    .lean();

  // Add question count, hide answers
  const items = quizzes.map((q) => ({
    ...q,
    questionCount: q.questions?.length || 0,
    questions: undefined,
  }));

  res.json(new ApiResponse(200, items, 'Course quizzes fetched'));
});
