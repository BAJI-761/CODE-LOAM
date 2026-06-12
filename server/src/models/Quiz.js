const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length === 4,
      message: 'Each question must have exactly 4 options',
    },
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  explanation: String,
  points: { type: Number, default: 10 },
}, { _id: true });

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    // optional — standalone quizzes allowed
  },
  moduleIndex: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timeLimit: { type: Number, required: true, default: 15 }, // minutes
  passingScore: { type: Number, default: 60 }, // percentage
  questions: [QuestionSchema],
  isAIGenerated: { type: Boolean, default: false },
  totalPoints: Number, // calculated
}, { timestamps: true });

// Pre-save: calculate totalPoints
QuizSchema.pre('save', function () {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 10), 0);
  } else {
    this.totalPoints = 0;
  }
});

module.exports = mongoose.model('Quiz', QuizSchema);
