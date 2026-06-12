require('dotenv').config({ path: './server/.env' });
const axios = require('axios');

async function test() {
  console.log('Testing Quiz API...');
  
  try {
    // 1. Login
    const login = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'student@test.com', // changed from student@codeloom.com because smoke test uses student@test.com
      password: 'password123',
    });
    const token = login.data.data?.token || login.data.token;
    console.log('✅ Logged in successfully');
    
    // 2. Fetch courses to find one with quizzes, or just fetch all challenges/quizzes
    // Since we can't fetch all quizzes directly (no route), we fetch by course
    const courses = await axios.get('http://localhost:5000/api/v1/courses', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const courseId = courses.data.data.items[0]._id;
    
    const quizzesRes = await axios.get(`http://localhost:5000/api/v1/quizzes/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const quizzes = quizzesRes.data.data;
    console.log(`✅ Found ${quizzes.length} quizzes for course`);
    
    if (quizzes.length === 0) {
      console.log('No quizzes found. Exiting.');
      return;
    }
    
    const quizId = quizzes[0]._id;
    
    // 3. GET /quizzes/:id
    console.log(`\n--- GET /api/v1/quizzes/${quizId} ---`);
    const quizDetail = await axios.get(`http://localhost:5000/api/v1/quizzes/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(JSON.stringify(quizDetail.data, null, 2));
    
    // Check if correctAnswer is exposed
    const hasAnswer = quizDetail.data.data.questions.some(q => q.correctAnswer !== undefined);
    console.log(`correctAnswer exposed: ${hasAnswer}`);
    
    // 4. POST /quizzes/:id/attempt
    console.log(`\n--- POST /api/v1/quizzes/${quizId}/attempt ---`);
    const attemptPayload = {
      answers: [
        { questionIndex: 0, selectedOption: 1 },
        { questionIndex: 1, selectedOption: 0 }
      ],
      timeTaken: 120
    };
    const attemptRes = await axios.post(`http://localhost:5000/api/v1/quizzes/${quizId}/attempt`, attemptPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(JSON.stringify(attemptRes.data, null, 2));
    
    // 5. GET /quizzes/:id/results
    console.log(`\n--- GET /api/v1/quizzes/${quizId}/results ---`);
    const resultsRes = await axios.get(`http://localhost:5000/api/v1/quizzes/${quizId}/results`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(JSON.stringify(resultsRes.data, null, 2));

  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();
