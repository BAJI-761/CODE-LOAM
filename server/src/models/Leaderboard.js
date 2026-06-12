const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  totalPoints: { type: Number, default: 0 },
  challengesSolved: { type: Number, default: 0 },
  quizzesPassed: { type: Number, default: 0 },
  coursesCompleted: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  rank: Number,
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

// Index for ranking queries (descending points)
LeaderboardSchema.index({ totalPoints: -1 });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
