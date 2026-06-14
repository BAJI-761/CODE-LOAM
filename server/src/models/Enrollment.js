const mongoose = require('mongoose');
const { ENROLLMENT_STATUSES } = require('../utils/constants');

const EnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  completionPercentage: { type: Number, default: 0 },
  lastAccessedModule: { type: Number, default: 0 },
  lastAccessedLesson: { type: Number, default: 0 },
  lastAccessedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ENROLLMENT_STATUSES,
    default: 'active',
  },
  completedAt: Date,
}, { timestamps: true });

// Compound unique index: one enrollment per student per course
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
