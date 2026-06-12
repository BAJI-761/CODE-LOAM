const mongoose = require('mongoose');
require('dotenv').config();
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const User = require('../models/User');

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codeloom-seed';
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB for seeding quizzes');
  } catch (err) {
    console.warn('⚠️ Could not connect to MongoDB at', MONGODB_URI);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  }

  const course = await Course.findOne();
  if (!course) {
    console.log('No course found to attach quizzes to. Run index seed first.');
    process.exit(1);
  }

  await Quiz.deleteMany({});

  const sampleQuizzes = [
    {
      title: 'JavaScript Basics Quiz',
      description: 'Test your knowledge of JS variables and types.',
      course: course._id,
      questions: [
        { question: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'function', 'None'], correctAnswer: 1, explanation: 'let is block-scoped.' },
        { question: 'What is typeof null?', options: ['object', 'null', 'undefined', 'number'], correctAnswer: 0, explanation: 'In JS, typeof null is "object" due to an early bug.' }
      ],
      durationMinutes: 10,
      passingScore: 50
    },
    {
      title: 'React Fundamentals Quiz',
      description: 'Basic React concepts.',
      course: course._id,
      questions: [
        { question: 'Which hook manages state?', options: ['useEffect', 'useState', 'useContext', 'useRef'], correctAnswer: 1, explanation: 'useState is for state management.' },
        { question: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON X', 'None'], correctAnswer: 0, explanation: 'JSX stands for JavaScript XML.' }
      ],
      durationMinutes: 10,
      passingScore: 50
    },
    {
      title: 'Node.js Core Quiz',
      description: 'Test your Node.js understanding.',
      course: course._id,
      questions: [
        { question: 'What is the default package manager for Node.js?', options: ['yarn', 'npm', 'pnpm', 'npx'], correctAnswer: 1, explanation: 'npm comes by default.' },
        { question: 'Which module is used for file system operations?', options: ['http', 'path', 'fs', 'crypto'], correctAnswer: 2, explanation: 'fs stands for file system.' }
      ],
      durationMinutes: 10,
      passingScore: 50
    },
    {
      title: 'CSS Styling Quiz',
      description: 'Check your styling skills.',
      course: course._id,
      questions: [
        { question: 'What property makes a flex container?', options: ['display: block', 'display: grid', 'display: flex', 'float: left'], correctAnswer: 2, explanation: 'display: flex creates a flex container.' },
        { question: 'How to center an element in flexbox horizontally?', options: ['align-items: center', 'justify-content: center', 'text-align: center', 'vertical-align: middle'], correctAnswer: 1, explanation: 'justify-content: center centers horizontally in row direction.' }
      ],
      durationMinutes: 10,
      passingScore: 50
    },
    {
      title: 'Advanced Web Dev Quiz',
      description: 'Test your advanced knowledge.',
      course: course._id,
      questions: [
        { question: 'What does CORS stand for?', options: ['Cross-Origin Resource Sharing', 'Cross-Origin Request Security', 'Cross-Origin Resource Security', 'None'], correctAnswer: 0, explanation: 'CORS is Cross-Origin Resource Sharing.' },
        { question: 'Which status code means "Not Found"?', options: ['200', '400', '404', '500'], correctAnswer: 2, explanation: '404 is the standard Not Found code.' }
      ],
      durationMinutes: 10,
      passingScore: 50
    }
  ];

  await Quiz.insertMany(sampleQuizzes);
  console.log('Seeded 5 sample quizzes');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
