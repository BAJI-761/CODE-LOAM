const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Course = require('../models/Course');

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codeloom-seed';
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');
  } catch (err) {
    console.warn('⚠️ Could not connect to MongoDB at', MONGODB_URI);
    console.log('🔄 Falling back to in-memory MongoDB (mongodb-memory-server) for seeding...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log('✅ Connected to in-memory MongoDB at', memUri);
  }

  // cleanup
  await User.deleteMany({});
  await Course.deleteMany({});

  // create instructor
  const instructor = await User.create({
    name: 'Jordan Instructor',
    email: 'instructor@example.com',
    password: 'password123',
    role: 'instructor',
    bio: 'Experienced instructor in web development',
  });

  const sampleCourses = [
    {
      title: 'Intro to JavaScript',
      slug: 'intro-to-javascript',
      description: 'Learn the fundamentals of JavaScript, the language of the web.',
      category: 'web-development',
      difficulty: 'beginner',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      instructor: instructor._id,
      published: true,
      modules: [
        { title: 'Basics', order: 1, lessons: [ { title: 'Variables', videoUrl: '', duration: 300, order: 1 }, { title: 'Functions', videoUrl: '', duration: 420, order: 2 } ] },
        { title: 'DOM', order: 2, lessons: [ { title: 'Selectors', videoUrl: '', duration: 360, order: 1 } ] },
      ],
    },
    {
      title: 'React for Beginners',
      slug: 'react-for-beginners',
      description: 'A hands-on guide to building apps with React.',
      category: 'web-development',
      difficulty: 'beginner',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      instructor: instructor._id,
      published: true,
      modules: [
        { title: 'Getting Started', order: 1, lessons: [ { title: 'JSX', videoUrl: '', duration: 300, order: 1 }, { title: 'Components', videoUrl: '', duration: 420, order: 2 } ] },
      ],
    },
    {
      title: 'Node.js APIs',
      slug: 'nodejs-apis',
      description: 'Build scalable APIs with Node.js and Express.',
      category: 'web-development',
      difficulty: 'intermediate',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      instructor: instructor._id,
      published: true,
      modules: [
        { title: 'Express', order: 1, lessons: [ { title: 'Routing', videoUrl: '', duration: 400, order: 1 } ] },
      ],
    },
    {
      title: 'CSS Layouts',
      slug: 'css-layouts',
      description: 'Modern CSS techniques for layouts and responsive design.',
      category: 'web-development',
      difficulty: 'intermediate',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      instructor: instructor._id,
      published: true,
      modules: [
        { title: 'Flexbox', order: 1, lessons: [ { title: 'Flex Basics', videoUrl: '', duration: 240, order: 1 } ] },
      ],
    },
    {
      title: 'Advanced TypeScript',
      slug: 'advanced-typescript',
      description: 'Deep dive into TypeScript for large codebases.',
      category: 'web-development',
      difficulty: 'advanced',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      instructor: instructor._id,
      published: false,
      modules: [
        { title: 'Types', order: 1, lessons: [ { title: 'Generics', videoUrl: '', duration: 600, order: 1 } ] },
      ],
    },
  ];

  for (const c of sampleCourses) {
    await Course.create(c);
  }

  console.log('Seeded sample courses');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
