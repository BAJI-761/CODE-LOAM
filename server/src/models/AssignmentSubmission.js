const mongoose = require('mongoose');
const { ASSIGNMENT_STATUSES } = require('../utils/constants');

const AssignmentSubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  content: String,
  fileUrl: String, // Cloudinary URL
  score: Number,
  feedback: String,
  status: {
    type: String,
    enum: ASSIGNMENT_STATUSES,
    default: 'submitted',
  },
}, { timestamps: true });

AssignmentSubmissionSchema.index({ student: 1, assignment: 1 });

module.exports = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
