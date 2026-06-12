const mongoose = require('mongoose');
const { SUPPORTED_LANGUAGES, SUBMISSION_VERDICTS } = require('../utils/constants');

const TestCaseResultSchema = new mongoose.Schema({
  testCaseIndex: Number,
  passed: { type: Boolean, default: false },
  output: String,
  expectedOutput: String,
  executionTime: String,
  error: String,
}, { _id: false });

const CodeSubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingChallenge',
    required: true,
  },
  language: {
    type: String,
    enum: SUPPORTED_LANGUAGES,
    required: true,
  },
  code: { type: String, required: true },
  results: [TestCaseResultSchema],
  status: {
    type: String,
    enum: ['accepted', 'wrong_answer', 'time_limit', 'runtime_error', 'compilation_error'],
    required: true,
  },
  passedCount: Number,
  totalCount: Number,
  score: Number,
}, { timestamps: true });

// Compound index for lookups
CodeSubmissionSchema.index({ student: 1, challenge: 1 });

module.exports = mongoose.model('CodeSubmission', CodeSubmissionSchema);
