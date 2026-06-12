const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
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
  certificateId: {
    type: String,
    unique: true,
    required: true,
  }, // UUID for verification
  issuedAt: { type: Date, default: Date.now },
  grade: String, // A, B, C based on quiz scores
  completionPercentage: Number,
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
