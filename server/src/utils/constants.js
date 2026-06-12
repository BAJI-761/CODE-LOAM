/**
 * Application-wide constants
 */

const COURSE_CATEGORIES = [
  'web-development',
  'data-science',
  'mobile-development',
  'devops',
  'algorithms',
  'databases',
  'ai-ml',
  'system-design',
];

const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];

const CHALLENGE_CATEGORIES = [
  'arrays',
  'strings',
  'linked-lists',
  'trees',
  'dynamic-programming',
  'sorting',
  'searching',
  'math',
  'graphs',
  'recursion',
];

const CHALLENGE_DIFFICULTIES = ['easy', 'medium', 'hard'];

const SUPPORTED_LANGUAGES = ['javascript', 'python', 'cpp', 'java'];

const USER_ROLES = ['student', 'instructor', 'admin'];

const ENROLLMENT_STATUSES = ['active', 'completed', 'dropped'];

const SUBMISSION_STATUSES = [
  'accepted',
  'wrong_answer',
  'time_limit',
  'runtime_error',
  'compilation_error',
];

const SUBMISSION_VERDICTS = [
  'accepted',
  'wrong_answer',
  'runtime_error',
  'compile_error',
  'time_limit',
  'internal_error',
];

const LESSON_TYPES = ['video', 'text', 'resource'];

const ASSIGNMENT_STATUSES = ['submitted', 'graded', 'returned'];

const CHAT_CONTEXT_TYPES = ['course', 'challenge', 'general'];

module.exports = {
  COURSE_CATEGORIES,
  DIFFICULTY_LEVELS,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
  SUPPORTED_LANGUAGES,
  USER_ROLES,
  ENROLLMENT_STATUSES,
  SUBMISSION_STATUSES,
  SUBMISSION_VERDICTS,
  LESSON_TYPES,
  ASSIGNMENT_STATUSES,
  CHAT_CONTEXT_TYPES,
};
