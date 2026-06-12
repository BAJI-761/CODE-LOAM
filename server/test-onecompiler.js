require('dotenv').config({ path: './.env' });
const axios = require('axios');

const API_KEY = process.env.ONECOMPILER_API_KEY;
const API_URL = process.env.ONECOMPILER_API_URL;

if (!API_KEY) {
  console.error('❌ ONECOMPILER_API_KEY not in .env');
  process.exit(1);
}

async function test() {
  console.log('🧪 Testing OneCompiler Direct API\n');
  console.log(`URL: ${API_URL}`);
  console.log(`Key: ${API_KEY.substring(0, 12)}...\n`);
  
  // Test 1: Simple Python execution
  console.log('━━━ TEST 1: Python single execution ━━━');
  try {
    const res = await axios.post(API_URL, {
      language: 'python',
      stdin: 'World',
      files: [{ name: 'main.py', content: 'name = input()\nprint(f"Hello {name}")' }]
    }, {
      headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
      timeout: 15000,
    });
    
    console.log('✅ Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2));
    console.log(`Credits remaining: ${res.data.limitRemaining}\n`);
  } catch (err) {
    console.error('❌ FAILED:', err.response?.status, JSON.stringify(err.response?.data));
    process.exit(1);
  }
  
  // Test 2: Batch execution (this is the powerful one!)
  console.log('━━━ TEST 2: Python BATCH execution (3 test cases in 1 call) ━━━');
  try {
    const res = await axios.post(API_URL, {
      language: 'python',
      stdin: ['5', '10', '15'],
      files: [{ name: 'main.py', content: 'n = int(input())\nprint(n * 2)' }]
    }, {
      headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
      timeout: 15000,
    });
    
    console.log('✅ Status:', res.status);
    console.log('Response (array):', JSON.stringify(res.data, null, 2));
    console.log('\n👉 Confirm: Got an ARRAY of 3 results, one per stdin value\n');
  } catch (err) {
    console.error('❌ FAILED:', err.response?.status, JSON.stringify(err.response?.data));
  }
  
  // Test 3: JavaScript
  console.log('━━━ TEST 3: JavaScript ━━━');
  try {
    const res = await axios.post(API_URL, {
      language: 'javascript',
      stdin: '42',
      files: [{ 
        name: 'index.js', 
        content: 'const n = parseInt(require("fs").readFileSync(0, "utf-8").trim());\nconsole.log(n * 2);' 
      }]
    }, {
      headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
      timeout: 15000,
    });
    console.log('✅ Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2), '\n');
  } catch (err) {
    console.error('❌ FAILED:', err.response?.data);
  }
  
  // Test 4: C++
  console.log('━━━ TEST 4: C++ ━━━');
  try {
    const res = await axios.post(API_URL, {
      language: 'cpp',
      stdin: '7',
      files: [{ 
        name: 'main.cpp', 
        content: '#include <iostream>\nusing namespace std;\nint main() { int n; cin >> n; cout << n * 2; return 0; }' 
      }]
    }, {
      headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
      timeout: 20000,
    });
    console.log('✅ Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2), '\n');
  } catch (err) {
    console.error('❌ FAILED:', err.response?.data);
  }
  
  // Test 5: Java
  console.log('━━━ TEST 5: Java ━━━');
  try {
    const res = await axios.post(API_URL, {
      language: 'java',
      stdin: '9',
      files: [{ 
        name: 'Main.java', 
        content: 'import java.util.Scanner;\npublic class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); int n = sc.nextInt(); System.out.println(n * 2); } }' 
      }]
    }, {
      headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
      timeout: 20000,
    });
    console.log('✅ Status:', res.status);
    console.log('Response:', JSON.stringify(res.data, null, 2), '\n');
  } catch (err) {
    console.error('❌ FAILED:', err.response?.data);
  }
  
  console.log('━━━ DONE ━━━');
  console.log('Total credits used in this test: ~5');
}

test();
