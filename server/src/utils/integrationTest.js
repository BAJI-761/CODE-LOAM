const axios = require('axios');
require('dotenv').config();

const API = (base = 'http://localhost:5000/api/v1') => axios.create({ baseURL: base, headers: { 'Content-Type': 'application/json' } });

async function run() {
  const client = API();
  try {
    console.log('1) Fetch courses');
    const listRes = await client.get('/courses');
    const courses = listRes.data.data.items || listRes.data.data || [];
    if (!courses.length) throw new Error('No courses available to enroll');
    const course = courses[0];
    console.log('Selected course:', course.title, course._id);

    const timestamp = Date.now();
    const email = `test_student_${timestamp}@example.com`;
    const password = 'password123';

    console.log('2) Registering test student:', email);
    await client.post('/auth/register', { name: 'Test Student', email, password });

    console.log('3) Logging in');
    const loginRes = await client.post('/auth/login', { email, password });
    const token = loginRes.data.data?.token || loginRes.data.token || loginRes.data?.data;
    // some implementations return differently
    const authToken = loginRes.data.data?.token || loginRes.data.token || (loginRes.data.data && loginRes.data.data.token) || loginRes.data;
    // try to extract token
    let bearer = null;
    if (loginRes.data?.data?.token) bearer = loginRes.data.data.token;
    else if (loginRes.data?.token) bearer = loginRes.data.token;
    else if (typeof loginRes.data === 'string') bearer = loginRes.data;

    if (!bearer) {
      console.warn('Login response', loginRes.data);
      throw new Error('Could not locate token in login response');
    }

    const authClient = API();
    authClient.defaults.headers.common['Authorization'] = `Bearer ${bearer}`;

    console.log('4) Enrolling in course');
    const enrollRes = await authClient.post(`/courses/${course._id}/enroll`);
    console.log('Enroll response:', enrollRes.data);

    console.log('5) Fetching learn payload');
    const learnRes = await authClient.get(`/courses/${course._id}/learn`);
    const { course: coursePayload, progress } = learnRes.data.data || learnRes.data;
    console.log('Learn payload course title:', coursePayload.title);

    // find first lesson
    let lessonId = null;
    for (const m of coursePayload.modules || []) {
      if (m.lessons && m.lessons.length) { lessonId = m.lessons[0]._id; break; }
    }
    if (!lessonId) throw new Error('No lesson found in course');
    console.log('6) Marking lesson complete:', lessonId);
    const progRes = await authClient.put(`/courses/${course._id}/progress`, { lessonId, completed: true });
    console.log('Progress update:', progRes.data);

    console.log('7) Verifying enrollment');
    const myEnrollRes = await authClient.get('/courses/student/enrollments');
    console.log('My enrollments:', myEnrollRes.data.data);

    console.log('Integration test completed successfully');
  } catch (err) {
    console.error('Integration test failed:', err.response?.data || err.message || err);
    process.exitCode = 2;
  }
}

if (require.main === module) run();
module.exports = run;
