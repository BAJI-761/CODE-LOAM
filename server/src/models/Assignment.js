const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String, // Markdown
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  moduleIndex: Number,
  dueDate: Date,
  maxScore: { type: Number, default: 100 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

AssignmentSchema.index({ course: 1 });
AssignmentSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Assignment', AssignmentSchema);
