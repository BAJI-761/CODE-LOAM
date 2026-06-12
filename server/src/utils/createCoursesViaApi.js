const axios = require('axios');
require('dotenv').config();

const API_BASE = 'http://localhost:5000/api/v1';
const client = axios.create({ baseURL: API_BASE });

async function run() {
  try {
    const timestamp = Date.now();
    const instructorEmail = `instructor_test_${timestamp}@example.com`;
    const password = 'password123';
    console.log('Registering instructor', instructorEmail);
    await client.post('/auth/register', { name: 'Auto Instructor', email: instructorEmail, password, role: 'instructor' });
    const loginRes = await client.post('/auth/login', { email: instructorEmail, password });
    const token = loginRes.data.data?.token || loginRes.data.token;
    if (!token) throw new Error('Login failed to return token');
    const auth = axios.create({ baseURL: API_BASE, headers: { Authorization: `Bearer ${token}` } });

    const sample = [
      { title: 'Auto JS Basics', slug: 'auto-js-basics', description: 'Auto seeded JS course', category: 'Programming', difficulty: 'beginner', thumbnailUrl: '', price: 0, published: true },
      { title: 'Auto React', slug: 'auto-react', description: 'Auto seeded React course', category: 'Frontend', difficulty: 'beginner', thumbnailUrl: '', price: 0, published: true },
      { title: 'Auto Node', slug: 'auto-node', description: 'Auto seeded Node course', category: 'Backend', difficulty: 'intermediate', thumbnailUrl: '', price: 0, published: true },
      { title: 'Auto CSS', slug: 'auto-css', description: 'Auto seeded CSS course', category: 'Design', difficulty: 'intermediate', thumbnailUrl: '', price: 0, published: true },
      { title: 'Auto TS Advanced', slug: 'auto-ts-advanced', description: 'Auto seeded TS course', category: 'Programming', difficulty: 'advanced', thumbnailUrl: '', price: 0, published: true },
    ];

    for (const c of sample) {
      const res = await auth.post('/instructor/courses', c);
      const created = res.data.data;
      console.log('Created course:', created.title || created);
      // add a module
      const modRes = await auth.post(`/instructor/courses/${created._id}/modules`, { title: 'Introduction', description: 'Intro module' });
      const mod = modRes.data.data.modules.slice(-1)[0];
      // add a lesson with placeholder video
      await auth.post(`/instructor/courses/${created._id}/lessons`, { moduleId: mod._id, title: 'Lesson 1', description: 'First lesson', videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4', duration: 120 });
    }

    console.log('Done creating courses');
  } catch (err) {
    console.error('Create courses failed:', err.response?.data || err.message || err);
    process.exitCode = 2;
  }
}

if (require.main === module) run();
module.exports = run;
