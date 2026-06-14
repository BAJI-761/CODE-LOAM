const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const CodingChallenge = require('../models/CodingChallenge');
const Enrollment = require('../models/Enrollment');
const CodeSubmission = require('../models/CodeSubmission');
const Leaderboard = require('../models/Leaderboard');
const Certificate = require('../models/Certificate');

const { COURSE_CATEGORIES, DIFFICULTY_LEVELS, CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } = require('../utils/constants');

const IMAGES = [
  '/images/seeds/course_banner_python_1781433136618.png',
  '/images/seeds/course_banner_react_1781433151800.png',
  '/images/seeds/course_banner_ml_1781433166184.png',
  '/images/seeds/course_banner_web3_1781433179582.png',
  '/images/seeds/course_banner_algo_1781433195363.png',
];

const AVATARS = [
  '/images/seeds/avatar_1_1781433217888.png',
  '/images/seeds/avatar_2_1781433231762.png',
  '/images/seeds/avatar_3_1781433246347.png',
];

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const passwordHash = await bcrypt.hash('password123', 12);

    console.log('Creating Instructors...');
    const instructors = [];
    for (let i = 1; i <= 10; i++) {
      const ins = new User({
        name: `Pro Instructor ${Date.now()}_${i}`,
        email: `instructor_${Date.now()}_${i}@codeloom.com`,
        password: 'password123',
        role: 'instructor',
        avatar: AVATARS[i % AVATARS.length],
        bio: `I am an expert software engineer with 10+ years of experience teaching others how to code.`,
        totalPoints: Math.floor(Math.random() * 5000),
      });
      // Bypass the pre-save hook that hashes if we manually hash, or just let pre-save do it:
      ins.password = 'password123'; // let pre-save handle it
      await ins.save();
      instructors.push(ins);
    }

    console.log('Creating Students...');
    const students = [];
    for (let i = 1; i <= 10; i++) {
      const stu = new User({
        name: `Active Student ${Date.now()}_${i}`,
        email: `student_${Date.now()}_${i}@codeloom.com`,
        password: 'password123',
        role: 'student',
        avatar: AVATARS[i % AVATARS.length],
        bio: `Passionate about coding and solving complex problems.`,
        streak: Math.floor(Math.random() * 10),
        totalPoints: 0,
      });
      await stu.save();
      students.push(stu);

      await new Leaderboard({
        user: stu._id,
        totalPoints: 0,
        challengesSolved: 0,
        quizzesPassed: 0,
        coursesCompleted: 0,
        currentStreak: stu.streak,
        longestStreak: stu.streak + 5
      }).save();
    }

    console.log('Creating Courses & Challenges...');
    const allCourses = [];
    let challengeIdCounter = 1;

    for (const instructor of instructors) {
      // 2 courses per instructor
      for (let c = 1; c <= 2; c++) {
        const cat = COURSE_CATEGORIES[Math.floor(Math.random() * COURSE_CATEGORIES.length)];
        const diff = DIFFICULTY_LEVELS[Math.floor(Math.random() * DIFFICULTY_LEVELS.length)];
        
        const course = new Course({
          title: `Mastering ${cat.replace('-', ' ')} - Part ${c}`,
          description: `A comprehensive guide to ${cat} taught by industry experts. Build real-world projects and ace your interviews.`,
          thumbnail: IMAGES[Math.floor(Math.random() * IMAGES.length)],
          instructor: instructor._id,
          category: cat,
          difficulty: diff,
          tags: ['programming', cat, 'featured'],
          isPublished: true,
          price: Math.random() > 0.5 ? 0 : 49.99,
          modules: [
            {
              title: 'Getting Started',
              order: 1,
              lessons: [
                { title: 'Introduction', type: 'video', duration: 15, order: 1, content: 'Welcome to the course.' },
                { title: 'Setup', type: 'text', duration: 10, order: 2, content: '# Installation\\nRun npm install.' }
              ]
            },
            {
              title: 'Advanced Concepts',
              order: 2,
              lessons: [
                { title: 'Deep Dive', type: 'video', duration: 45, order: 1, content: 'Let us go deep.' },
                { title: 'Summary', type: 'text', duration: 5, order: 2, content: 'You made it to the end.' }
              ]
            }
          ]
        });
        
        await course.save();
        allCourses.push(course);

        // Create 2 challenges for this course
        for (let ch = 1; ch <= 2; ch++) {
          const ccat = CHALLENGE_CATEGORIES[Math.floor(Math.random() * CHALLENGE_CATEGORIES.length)];
          const cdiff = CHALLENGE_DIFFICULTIES[Math.floor(Math.random() * CHALLENGE_DIFFICULTIES.length)];

          const challenge = new CodingChallenge({
            title: `Challenge ${challengeIdCounter++}: ${ccat} basics`,
            description: `Write a function that solves the ${ccat} problem efficiently.\\n\\n**Constraints:**\\n- Time Complexity: O(N)\\n- Space: O(1)`,
            difficulty: cdiff,
            category: ccat,
            points: cdiff === 'easy' ? 50 : (cdiff === 'medium' ? 100 : 200),
            course: course._id,
            createdBy: instructor._id,
            starterCode: {
              javascript: 'function solve(input) {\n  // your code here\n}',
              python: 'def solve(input):\n  # your code here',
            },
            testCases: [
              { input: '"test"', expectedOutput: '"test"', isHidden: false },
              { input: '"hidden"', expectedOutput: '"hidden"', isHidden: true }
            ]
          });
          await challenge.save();
        }
      }
    }

    console.log('Creating Enrollments, Submissions & Certificates...');
    for (const student of students) {
      // Pick 5 random courses
      const shuffled = allCourses.sort(() => 0.5 - Math.random());
      const selectedCourses = shuffled.slice(0, 5);

      let studentPoints = 0;
      let challengesSolved = 0;
      let coursesCompleted = 0;

      for (const course of selectedCourses) {
        // Complete the course
        const enrollment = new Enrollment({
          student: student._id,
          course: course._id,
          status: 'completed',
          progress: 100,
          completedLessons: course.modules.flatMap(m => m.lessons.map(l => l._id))
        });
        await enrollment.save();

        // Increment counts
        coursesCompleted++;
        studentPoints += 200; // Bonus for completion
        course.enrollmentCount += 1;
        await course.save();

        // Solve course challenges
        const challenges = await CodingChallenge.find({ course: course._id });
        for (const challenge of challenges) {
          const submission = new CodeSubmission({
            student: student._id,
            challenge: challenge._id,
            language: 'javascript',
            code: 'function solve(input) { return input; }',
            status: 'accepted',
            passedCount: 2,
            totalCount: 2,
            score: challenge.points,
            results: [
              { passed: true, output: '"test"', expectedOutput: '"test"', executionTime: '10ms' },
              { passed: true, output: '"hidden"', expectedOutput: '"hidden"', executionTime: '12ms' }
            ]
          });
          await submission.save();

          challenge.solvedCount += 1;
          await challenge.save();

          studentPoints += challenge.points;
          challengesSolved++;
        }

        // Generate Certificate
        await new Certificate({
          student: student._id,
          course: course._id,
          issuedAt: new Date(),
          certificateId: `CERT-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          completionPercentage: 100,
          grade: 'A'
        }).save();
      }

      // Update student points and leaderboard
      student.totalPoints = studentPoints;
      await student.save();

      await Leaderboard.findOneAndUpdate(
        { user: student._id },
        { 
          totalPoints: studentPoints,
          challengesSolved: challengesSolved,
          coursesCompleted: coursesCompleted
        }
      );
    }

    console.log('Bulk Data Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
