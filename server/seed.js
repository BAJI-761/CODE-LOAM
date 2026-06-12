require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Enrollment = require('./src/models/Enrollment');
const Quiz = require('./src/models/Quiz');
const QuizAttempt = require('./src/models/QuizAttempt');
const CodingChallenge = require('./src/models/CodingChallenge');
const CodeSubmission = require('./src/models/CodeSubmission');
const Certificate = require('./src/models/Certificate');
const ChatHistory = require('./src/models/ChatHistory');
const Assignment = require('./src/models/Assignment');
const AssignmentSubmission = require('./src/models/AssignmentSubmission');
const Leaderboard = require('./src/models/Leaderboard');

const seedDatabase = async () => {
  try {
    console.log('Cleaning existing data (Idempotent seed)...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Quiz.deleteMany({});
    await QuizAttempt.deleteMany({});
    await CodingChallenge.deleteMany({});
    await CodeSubmission.deleteMany({});
    await Certificate.deleteMany({});
    await ChatHistory.deleteMany({});
    await Assignment.deleteMany({});
    await AssignmentSubmission.deleteMany({});
    await Leaderboard.deleteMany({});
    console.log('✅ Database cleaned');

    console.log('Seeding new data...');
    
    // Create Users
    const plainPassword = 'password123';
    
    const instructor = await User.create({
      name: 'Instructor Jane',
      email: 'instructor@test.com',
      password: plainPassword,
      role: 'instructor',
    });

    const student1 = await User.create({
      name: 'Student Bob',
      email: 'student@codeloom.com',
      password: 'Password123!',
      role: 'student',
    });

    const student2 = await User.create({
      name: 'Student Alice',
      email: 'alice@test.com',
      password: plainPassword,
      role: 'student',
    });
    
    // Create Courses
    const course1 = await Course.create({
      title: 'Advanced React Patterns',
      description: 'Master modern React architecture, hooks, and performance optimization.',
      instructor: instructor._id,
      price: 0,
      level: 'advanced',
      category: 'web-development',
      isPublished: true,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      modules: [{
        title: 'Hooks Deep Dive',
        order: 1,
        lessons: [{
          title: 'Understanding useMemo and useCallback',
          type: 'video',
          content: 'https://example.com/video1.mp4',
          duration: 15,
          order: 1
        }, {
          title: 'Custom Hooks Architecture',
          type: 'text',
          content: 'Custom hooks are powerful...',
          duration: 10,
          order: 2
        }]
      }]
    });

    const course2 = await Course.create({
      title: 'Node.js Microservices',
      description: 'Build scalable microservices with Node.js and Docker.',
      instructor: instructor._id,
      price: 49.99,
      level: 'intermediate',
      category: 'devops',
      isPublished: true,
      modules: [{
        title: 'Docker Fundamentals',
        order: 1,
        lessons: [{
          title: 'Containerization Basics',
          type: 'video',
          content: 'https://example.com/video2.mp4',
          duration: 20,
          order: 1
        }]
      }]
    });

    // Create Enrollments
    await Enrollment.create({
      student: student1._id,
      course: course1._id,
      progress: {
        completedLessons: [course1.modules[0].lessons[0]._id],
        lastAccessedModule: course1.modules[0]._id,
        lastAccessedLesson: course1.modules[0].lessons[1]._id
      }
    });

    // Create Challenges
    const challengesData = [];
    for (let i = 1; i <= 10; i++) {
      challengesData.push({
        title: `Challenge ${i}: Algorithm Mastery`,
        description: `Solve algorithm ${i} to test your knowledge. Write a function that returns the input number.`,
        course: course1._id,
        createdBy: instructor._id,
        category: 'arrays',
        difficulty: i < 4 ? 'easy' : i < 8 ? 'medium' : 'hard',
        language: 'javascript',
        testCases: [{
          input: '5',
          expectedOutput: '5',
          isHidden: false
        }]
      });
    }
    const challenges = await CodingChallenge.insertMany(challengesData);

    // Create Quizzes
    const quiz1 = await Quiz.create({
      title: 'React Hooks Assessment',
      course: course1._id,
      createdBy: instructor._id,
      moduleIndex: 0,
      lessonIndex: 0,
      questions: [{
        questionText: 'What does useCallback do?',
        options: ['Memoizes a value', 'Memoizes a function', 'Runs an effect', 'Fetches data'],
        correctAnswer: 1,
        explanation: 'useCallback returns a memoized callback function.'
      }, {
        questionText: 'Is React a framework?',
        options: ['Yes', 'No, it is a library', 'It is an OS', 'None of the above'],
        correctAnswer: 1,
        explanation: 'React is a library for building user interfaces.'
      }]
    });

    const quiz2 = await Quiz.create({
      title: 'Docker Quiz',
      course: course2._id,
      createdBy: instructor._id,
      moduleIndex: 0,
      lessonIndex: 0,
      questions: [{
        questionText: 'What is a Dockerfile?',
        options: ['A text document containing commands', 'A container', 'An image', 'A volume'],
        correctAnswer: 0,
        explanation: 'It is a text document that contains all the commands a user could call on the command line to assemble an image.'
      }]
    });

    const quiz3 = await Quiz.create({
      title: 'Final Assessment',
      course: course1._id,
      createdBy: instructor._id,
      moduleIndex: 0,
      lessonIndex: 1,
      questions: [{
        questionText: 'Can custom hooks use other hooks?',
        options: ['Yes', 'No', 'Only in classes', 'Only in Redux'],
        correctAnswer: 0,
        explanation: 'Yes, custom hooks can call other hooks.'
      }]
    });

    // Create a Quiz Attempt
    await QuizAttempt.create({
      student: student1._id,
      quiz: quiz1._id,
      score: 100,
      totalQuestions: 2,
      passed: true,
      answers: [
        { questionId: quiz1.questions[0]._id, selectedOption: 1 },
        { questionId: quiz1.questions[1]._id, selectedOption: 1 }
      ]
    });

    // Create Certificates
    await Certificate.create({
      student: student1._id,
      course: course1._id,
      certificateId: 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      issuedAt: new Date()
    });

    // Create Leaderboard Entries
    await Leaderboard.create({
      user: student1._id,
      totalPoints: 500,
      challengesCompleted: 5,
      quizzesPassed: 2
    });

    await Leaderboard.create({
      user: student2._id,
      totalPoints: 100,
      challengesCompleted: 1,
      quizzesPassed: 0
    });

    console.log('🎉 Seeding Complete!');
    console.log('---------------------');
    console.log(`Users: 3`);
    console.log(`Courses: 2`);
    console.log(`Enrollments: 1`);
    console.log(`Challenges: 10`);
    console.log(`Quizzes: 3`);
    console.log(`Certificates: 1`);
    console.log('---------------------');

  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    console.error(err);
  }
};

module.exports = seedDatabase;

if (require.main === module) {
  const run = async () => {
    try {
      if (process.env.MONGODB_URI) {
        await mongoose.connect(process.env.MONGODB_URI);
        await seedDatabase();
      } else {
        console.error('MONGODB_URI not found');
      }
    } finally {
      await mongoose.disconnect();
    }
  };
  run();
}
