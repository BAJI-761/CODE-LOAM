const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  answers: [{
    questionIndex: Number,
    selectedOption: Number,
  }],
  score: { type: Number, default: 0 },
  totalPoints: Number,
  percentage: Number,
  timeTaken: Number, // seconds
  passed: Boolean,
  attemptedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Index for fast lookups
QuizAttemptSchema.index({ student: 1, quiz: 1 });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
