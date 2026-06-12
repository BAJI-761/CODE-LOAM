const http = require('http');

const API_URL = 'http://localhost:5000/api/v1';

async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  if (body) {
    options.body = JSON.stringify(body);
  }

  const start = Date.now();
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    const time = Date.now() - start;
    return { status: res.status, data, time };
  } catch (error) {
    return { status: 'ERROR', error: error.message, time: Date.now() - start };
  }
}

async function runSmokeTests() {
  const results = [];
  let token = null;
  let courseId = null;
  let challengeId = null;

  console.log('Running API Smoke Tests...');

  // 1. Login
  const loginRes = await fetchAPI('/auth/login', 'POST', { email: 'student@test.com', password: 'password123' });
  results.push({
    Endpoint: 'POST /auth/login',
    Status: loginRes.status,
    ResponseTime: `${loginRes.time}ms`,
    Notes: loginRes.status === 200 && loginRes.data.token ? 'Success. Token received.' : JSON.stringify(loginRes.data),
  });
  token = loginRes.data?.data?.token;

  // 2. Get Me
  const meRes = await fetchAPI('/auth/me', 'GET', null, token);
  results.push({
    Endpoint: 'GET /auth/me',
    Status: meRes.status,
    ResponseTime: `${meRes.time}ms`,
    Notes: meRes.status === 200 && meRes.data.success ? `Success. User: ${meRes.data.data?.user?.name}` : JSON.stringify(meRes.data),
  });

  // 3. Get Courses
  const coursesRes = await fetchAPI('/courses', 'GET');
  results.push({
    Endpoint: 'GET /courses',
    Status: coursesRes.status,
    ResponseTime: `${coursesRes.time}ms`,
    Notes: coursesRes.status === 200 && coursesRes.data.success ? `Success. Found ${coursesRes.data.data?.items?.length || 0} courses.` : JSON.stringify(coursesRes.data),
  });
  if (coursesRes.data?.data?.items?.length > 0) {
    courseId = coursesRes.data.data.items[0]._id;
  }

  // 4. Get Course Detail
  if (courseId) {
    const courseDetailRes = await fetchAPI(`/courses/${courseId}`, 'GET');
    results.push({
      Endpoint: `GET /courses/:id`,
      Status: courseDetailRes.status,
      ResponseTime: `${courseDetailRes.time}ms`,
      Notes: courseDetailRes.status === 200 && courseDetailRes.data.success ? 'Success. Course details loaded.' : JSON.stringify(courseDetailRes.data),
    });
  } else {
    results.push({ Endpoint: 'GET /courses/:id', Status: 'SKIPPED', ResponseTime: '-', Notes: 'No courseId found' });
  }

  // 5. Get Challenges
  const challengesRes = await fetchAPI('/challenges', 'GET');
  results.push({
    Endpoint: 'GET /challenges',
    Status: challengesRes.status,
    ResponseTime: `${challengesRes.time}ms`,
    Notes: challengesRes.status === 200 && challengesRes.data.success ? `Success. Found ${challengesRes.data.data?.items?.length || 0} challenges.` : JSON.stringify(challengesRes.data),
  });
  if (challengesRes.data?.data?.items?.length > 0) {
    challengeId = challengesRes.data.data.items[0]._id;
  }

  // 6. Get Challenge Detail
  if (challengeId) {
    const challengeDetailRes = await fetchAPI(`/challenges/${challengeId}`, 'GET');
    results.push({
      Endpoint: `GET /challenges/:id`,
      Status: challengeDetailRes.status,
      ResponseTime: `${challengeDetailRes.time}ms`,
      Notes: challengeDetailRes.status === 200 && challengeDetailRes.data.success ? 'Success. Challenge loaded.' : JSON.stringify(challengeDetailRes.data),
    });

    // 7. Run Code on Challenge
    const runRes = await fetchAPI(`/challenges/${challengeId}/run`, 'POST', {
      code: 'function solve(n) { return n; } console.log(solve(5));',
      language: 'javascript'
    }, token);
    results.push({
      Endpoint: `POST /challenges/:id/run`,
      Status: runRes.status,
      ResponseTime: `${runRes.time}ms`,
      Notes: runRes.status === 200 && runRes.data.success ? `Success. Status: ${runRes.data.data.status}` : JSON.stringify(runRes.data),
    });
  } else {
    results.push({ Endpoint: 'GET /challenges/:id', Status: 'SKIPPED', ResponseTime: '-', Notes: 'No challengeId found' });
    results.push({ Endpoint: 'POST /challenges/:id/run', Status: 'SKIPPED', ResponseTime: '-', Notes: 'No challengeId found' });
  }

  // 8. AI Chat
  const aiRes = await fetchAPI('/ai/chat', 'POST', {
    message: 'Hello!',
    context: { type: 'general' }
  }, token);
  results.push({
    Endpoint: 'POST /ai/chat',
    Status: aiRes.status,
    ResponseTime: `${aiRes.time}ms`,
    Notes: aiRes.status === 200 && aiRes.data.success ? 'Success. AI replied.' : JSON.stringify(aiRes.data),
  });

  // 9. Leaderboard
  const lbRes = await fetchAPI('/leaderboard', 'GET');
  results.push({
    Endpoint: 'GET /leaderboard',
    Status: lbRes.status,
    ResponseTime: `${lbRes.time}ms`,
    Notes: lbRes.status === 200 && lbRes.data.success ? 'Success. Leaderboard loaded.' : JSON.stringify(lbRes.data),
  });

  const fs = require('fs');
  fs.writeFileSync('smoke-test-results.json', JSON.stringify(results, null, 2));
  console.log('Results written to smoke-test-results.json');
}

runSmokeTests();
