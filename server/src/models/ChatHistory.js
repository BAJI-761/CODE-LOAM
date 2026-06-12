const mongoose = require('mongoose');
const { CHAT_CONTEXT_TYPES } = require('../utils/constants');

const ChatHistorySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  context: {
    type: {
      type: String,
      enum: CHAT_CONTEXT_TYPES,
    },
    referenceId: mongoose.Schema.Types.ObjectId,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

// Index for fast context-based lookups
ChatHistorySchema.index({ student: 1, 'context.type': 1, 'context.referenceId': 1 });

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);