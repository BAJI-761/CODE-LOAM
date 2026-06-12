const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const CodingChallenge = require('../models/CodingChallenge');
const CodeSubmission = require('../models/CodeSubmission');
const oneCompilerService = require('../services/oneCompilerService');

// GET /api/v1/challenges
const listChallenges = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, difficulty, category, search } = req.query;
  const query = {};

  if (difficulty) query.difficulty = difficulty;
  if (category) query.category = category;
  if (search) query.$or = [
    { title: new RegExp(search, 'i') },
    { description: new RegExp(search, 'i') },
  ];

  const skip = (Number(page) - 1) * Number(limit);
  const [total, rawItems] = await Promise.all([
    CodingChallenge.countDocuments(query),
    CodingChallenge.find(query)
      .select('-testCases')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
  ]);

  // Check which challenges the current user has solved
  let solvedSet = new Set();
  if (req.user?._id) {
    const solved = await CodeSubmission.find({
      student: req.user._id,
      status: 'accepted',
    }).select('challenge').lean();
    solvedSet = new Set(solved.map((s) => s.challenge.toString()));
  }

  const items = rawItems.map((item) => {
    const obj = item.toObject();
    obj.completionStatus = solvedSet.has(String(item._id)) ? 'completed' : 'pending';
    return obj;
  });

  res.json(new ApiResponse(200, { items, total, page: Number(page), limit: Number(limit) }, 'Challenges fetched'));
});

// GET /api/v1/challenges/:id
const getChallenge = asyncHandler(async (req, res) => {
  const challenge = await CodingChallenge.findById(req.params.id);
  if (!challenge) throw new ApiError(404, 'Challenge not found');

  // Hide hidden test cases from public view
  const publicChallenge = challenge.toObject();
  publicChallenge.testCases = publicChallenge.testCases.filter((tc) => !tc.isHidden);

  res.json(new ApiResponse(200, publicChallenge, 'Challenge fetched'));
});

// POST /api/v1/challenges (Instructor)
const createChallenge = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user._id,
  };

  const challenge = await CodingChallenge.create(payload);
  res.status(201).json(new ApiResponse(201, challenge, 'Challenge created'));
});

// PUT /api/v1/challenges/:id (Instructor)
const updateChallenge = asyncHandler(async (req, res) => {
  const challenge = await CodingChallenge.findById(req.params.id);
  if (!challenge) throw new ApiError(404, 'Challenge not found');
  if (!challenge.createdBy.equals(req.user._id)) throw new ApiError(403, 'Not authorized');
  Object.assign(challenge, req.body);
  await challenge.save();
  res.json(new ApiResponse(200, challenge, 'Challenge updated'));
});

// DELETE /api/v1/challenges/:id (Instructor)
const deleteChallenge = asyncHandler(async (req, res) => {
  const challenge = await CodingChallenge.findById(req.params.id);
  if (!challenge) throw new ApiError(404, 'Challenge not found');
  if (!challenge.createdBy.equals(req.user._id)) throw new ApiError(403, 'Not authorized');
  await CodingChallenge.findByIdAndDelete(req.params.id);
  res.json(new ApiResponse(200, null, 'Challenge deleted'));
});

// Internal: evaluate code against test cases
async function evaluateChallenge({ challenge, code, language, onlySample }) {
  const testCases = onlySample
    ? challenge.testCases.filter((tc) => !tc.isHidden)
    : challenge.testCases;

  if (!testCases.length) throw new ApiError(400, 'No test cases configured');

  const results = await oneCompilerService.runTestCases({
    language,
    code,
    testCases,
  });

  const passedCount = results.filter((r) => r.passed).length;
  let finalStatus = 'accepted';

  // Check for critical failures first (network/API issues)
  const criticalError = results.find(r => ['time_limit', 'rate_limit', 'error'].includes(r.status));
  if (criticalError) {
    finalStatus = criticalError.status;
  } else if (results.some((r) => r.error && !r.passed)) {
    // Check if any error was a compilation error
    const hasCompileErr = results.some((r) => r.status === 'compilation_error');
    finalStatus = hasCompileErr ? 'compilation_error' : 'runtime_error';
  } else if (passedCount !== testCases.length) {
    finalStatus = 'wrong_answer';
  }

  // Remove 'status' from the individual results before returning to frontend
  // to maintain identical response shape (or keep it, it won't hurt, but just in case)
  const mappedResults = results.map(r => ({
    testCaseIndex: r.testCaseIndex,
    passed: r.passed,
    output: r.output,
    expectedOutput: r.expectedOutput,
    executionTime: r.executionTime,
    error: r.error,
  }));

  return {
    status: finalStatus,
    passedCount,
    totalCount: testCases.length,
    score: passedCount === testCases.length ? (challenge.points || 100) : 0,
    results: mappedResults,
  };
}

// POST /api/v1/challenges/:id/run (Student — visible test cases only)
const runChallenge = asyncHandler(async (req, res) => {
  const { code, language } = req.body;
  const challenge = await CodingChallenge.findById(req.params.id);
  if (!challenge) throw new ApiError(404, 'Challenge not found');
  if (!code || !language) throw new ApiError(400, 'code and language are required');

  const evaluation = await evaluateChallenge({ challenge, code, language, onlySample: true });
  res.json(new ApiResponse(200, evaluation, 'Sample tests executed'));
});

// POST /api/v1/challenges/:id/submit (Student — ALL test cases)
const submitChallenge = asyncHandler(async (req, res) => {
  const { code, language } = req.body;
  const challenge = await CodingChallenge.findById(req.params.id);
  if (!challenge) throw new ApiError(404, 'Challenge not found');
  if (!code || !language) throw new ApiError(400, 'code and language are required');

  const evaluation = await evaluateChallenge({ challenge, code, language, onlySample: false });

  // Save submission
  const submission = await CodeSubmission.create({
    student: req.user._id,
    challenge: challenge._id,
    language,
    code,
    ...evaluation,
  });

  // Update solvedCount if accepted
  if (evaluation.status === 'accepted') {
    await CodingChallenge.findByIdAndUpdate(challenge._id, { $inc: { solvedCount: 1 } });
  }

  res.json(new ApiResponse(200, { ...evaluation, submissionId: submission._id }, 'Submission evaluated'));
});

// GET /api/v1/challenges/:id/submissions (Student)
const getSubmissionHistory = asyncHandler(async (req, res) => {
  const submissions = await CodeSubmission.find({
    challenge: req.params.id,
    student: req.user._id,
  }).sort({ createdAt: -1 }).limit(50);

  res.json(new ApiResponse(200, submissions, 'Submission history fetched'));
});

module.exports = {
  listChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  runChallenge,
  submitChallenge,
  getSubmissionHistory,
};
