const mongoose = require('mongoose');
const { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES, SUPPORTED_LANGUAGES } = require('../utils/constants');

const ExampleSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String,
}, { _id: false });

const TestCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  isHidden: { type: Boolean, default: false },
}, { _id: true });

const CodingChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true }, // Markdown
  difficulty: {
    type: String,
    enum: CHALLENGE_DIFFICULTIES,
    required: true,
  },
  category: {
    type: String,
    enum: CHALLENGE_CATEGORIES,
    required: true,
  },
  constraints: String,
  examples: [ExampleSchema],
  testCases: [TestCaseSchema],
  starterCode: {
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    cpp: { type: String, default: '' },
    java: { type: String, default: '' },
  },
  hints: [String],
  points: { type: Number, default: 100 },
  solvedCount: { type: Number, default: 0 },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    // optional — standalone challenges allowed
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Indexes
CodingChallengeSchema.index({ difficulty: 1 });
CodingChallengeSchema.index({ category: 1 });
CodingChallengeSchema.index({ createdBy: 1 });

module.exports = mongoose.model('CodingChallenge', CodingChallengeSchema);
