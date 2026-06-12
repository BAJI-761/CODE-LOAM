const mongoose = require('mongoose');
const { COURSE_CATEGORIES, DIFFICULTY_LEVELS, LESSON_TYPES } = require('../utils/constants');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: LESSON_TYPES, default: 'video' },
  videoUrl: String,
  content: String, // Markdown for text lessons
  resources: [{
    name: String,
    url: String,
  }],
  duration: { type: Number, default: 0 }, // minutes
  order: { type: Number, required: true },
}, { _id: true });

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  lessons: [LessonSchema],
}, { _id: true });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: COURSE_CATEGORIES,
    required: true,
  },
  difficulty: {
    type: String,
    enum: DIFFICULTY_LEVELS,
    required: true,
    default: 'beginner',
  },
  tags: [String],
  modules: [ModuleSchema],
  enrollmentCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  totalDuration: Number,  // calculated
  totalLessons: Number,   // calculated
}, { timestamps: true });

// Indexes
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ category: 1, isPublished: 1 });
CourseSchema.index({ difficulty: 1 });

// Pre-save: calculate totalLessons and totalDuration
CourseSchema.pre('save', function () {
  if (this.modules && this.modules.length > 0) {
    let lessonCount = 0;
    let durationSum = 0;
    for (const mod of this.modules) {
      if (mod.lessons) {
        lessonCount += mod.lessons.length;
        for (const lesson of mod.lessons) {
          durationSum += lesson.duration || 0;
        }
      }
    }
    this.totalLessons = lessonCount;
    this.totalDuration = durationSum;
  } else {
    this.totalLessons = 0;
    this.totalDuration = 0;
  }
});

module.exports = mongoose.model('Course', CourseSchema);
