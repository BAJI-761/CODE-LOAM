const axios = require('axios');

const API_KEY = process.env.ONECOMPILER_API_KEY;
const API_URL = process.env.ONECOMPILER_API_URL || 'https://api.onecompiler.com/v1/run';

// Map our language codes to OneCompiler language IDs and file names
const LANGUAGE_MAP = {
  javascript: { language: 'javascript', fileName: 'index.js' },
  python: { language: 'python', fileName: 'main.py' },
  cpp: { language: 'cpp', fileName: 'main.cpp' },
  java: { language: 'java', fileName: 'Main.java' },
};

// Credit tracking
let creditsUsedSession = 0;
let lastKnownCredits = null;

function getStats() {
  return { creditsUsedSession, lastKnownRemaining: lastKnownCredits };
}

/**
 * Map OneCompiler response to our internal status enum
 */
function mapStatus(response) {
  // API-level failure (network, auth, quota)
  if (response.status === 'failed') {
    if (response.error?.includes('E002')) return 'rate_limit';
    if (response.error?.includes('E001')) return 'time_limit';
    if (response.error?.includes('E003') || response.error?.includes('E004')) return 'error';
    return 'error';
  }
  
  // Code-level errors detected via exception field
  if (response.exception) {
    const exc = String(response.exception).toLowerCase();
    if (exc.includes('compile') || exc.includes('syntax')) return 'compilation_error';
    if (exc.includes('timeout') || exc.includes('timed out')) return 'time_limit';
    return 'runtime_error';
  }
  
  // Runtime errors detected via stderr
  if (response.stderr && response.stderr.trim().length > 0) {
    const err = String(response.stderr).toLowerCase();
    if (err.includes('error') && (err.includes('compile') || err.includes('syntax'))) {
      return 'compilation_error';
    }
    return 'runtime_error';
  }
  
  // Success
  return 'accepted';
}

/**
 * Execute single code submission
 */
async function executeCode({ language, code, stdin = '' }) {
  if (!LANGUAGE_MAP[language]) {
    throw new Error(`Unsupported language: ${language}`);
  }
  
  if (!API_KEY) {
    return {
      stdout: '',
      stderr: 'OneCompiler API not configured',
      executionTime: '0',
      status: 'error',
      error: 'Code execution service not configured. Set ONECOMPILER_API_KEY in .env',
    };
  }
  
  const { language: ocLang, fileName } = LANGUAGE_MAP[language];
  
  try {
    creditsUsedSession++;
    console.log(`[OneCompiler] Single call #${creditsUsedSession} | ${language}`);
    
    const response = await axios.post(
      API_URL,
      {
        language: ocLang,
        stdin: stdin || '',
        files: [{ name: fileName, content: code }],
      },
      {
        headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
        timeout: 20000,
      }
    );
    
    const data = response.data;
    
    if (data.creditsRemaining !== undefined) {
      lastKnownCredits = data.creditsRemaining;
      console.log(`[OneCompiler] Credits remaining: ${lastKnownCredits}`);
    }
    
    return {
      stdout: data.stdout || '',
      stderr: data.stderr || '',
      executionTime: String(data.executionTime || 0),
      memory: data.memoryUsed || 0,
      status: mapStatus(data),
      error: data.exception || data.error || null,
    };
    
  } catch (err) {
    console.error('[OneCompiler] Network error:', err.message);
    return {
      stdout: '',
      stderr: err.response?.data?.error || err.message,
      executionTime: '0',
      status: 'error',
      error: 'Code execution service unavailable',
    };
  }
}

/**
 * Run all test cases using BATCH execution (1 API call for all test cases)
 * This is the major efficiency win of OneCompiler
 */
async function runTestCases({ language, code, testCases }) {
  if (!testCases || testCases.length === 0) return [];
  
  if (!LANGUAGE_MAP[language]) {
    throw new Error(`Unsupported language: ${language}`);
  }
  
  if (!API_KEY) {
    return testCases.map((tc, i) => ({
      testCaseIndex: i,
      passed: false,
      output: '',
      expectedOutput: (tc.expectedOutput || '').trim(),
      executionTime: '0',
      error: 'OneCompiler API not configured',
    }));
  }
  
  const { language: ocLang, fileName } = LANGUAGE_MAP[language];
  const stdinArray = testCases.map(tc => tc.input || '');
  
  try {
    creditsUsedSession++;
    console.log(`[OneCompiler] BATCH call #${creditsUsedSession} | ${language} | ${testCases.length} test cases`);
    
    const response = await axios.post(
      API_URL,
      {
        language: ocLang,
        stdin: stdinArray,
        files: [{ name: fileName, content: code }],
      },
      {
        headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
        timeout: 60000, // longer timeout for batch
      }
    );
    
    const data = response.data;
    
    // For batch responses, check the LAST item (each item has its own count)
    if (Array.isArray(data)) {
      const lastItem = data[data.length - 1];
      if (lastItem?.creditsRemaining !== undefined) {
        lastKnownCredits = lastItem.creditsRemaining;
      }
    }
    
    // Response is an array of results matching stdin order
    const results = (Array.isArray(data) ? data : [data]).map((result, i) => {
      const tc = testCases[i];
      const actualOutput = (result.stdout || '').trim();
      const expectedOutput = (tc.expectedOutput || '').trim();
      const status = mapStatus(result);
      const passed = status === 'accepted' && actualOutput === expectedOutput;
      
      return {
        testCaseIndex: i,
        passed,
        output: actualOutput,
        expectedOutput,
        executionTime: String(result.executionTime || 0),
        error: result.exception || result.stderr || null,
        status,
      };
    });
    
    console.log(`[OneCompiler] Batch complete | Passed: ${results.filter(r => r.passed).length}/${results.length}`);
    if (lastKnownCredits !== null) {
      console.log(`[OneCompiler] Credits remaining: ${lastKnownCredits}`);
    }
    
    return results;
    
  } catch (err) {
    console.error('[OneCompiler] Batch error:', err.response?.data || err.message);
    
    // If batch fails, return failure for all test cases
    const errorMsg = err.response?.data?.error || err.message;
    return testCases.map((tc, i) => ({
      testCaseIndex: i,
      passed: false,
      output: '',
      expectedOutput: (tc.expectedOutput || '').trim(),
      executionTime: '0',
      error: errorMsg,
    }));
  }
}

async function isAvailable() {
  if (!API_KEY) return false;
  try {
    const res = await axios.post(
      API_URL,
      {
        language: 'javascript',
        stdin: '',
        files: [{ name: 'index.js', content: 'console.log("ping");' }],
      },
      {
        headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
        timeout: 5000,
      }
    );
    if (res.data?.creditsRemaining !== undefined) {
      lastKnownCredits = res.data.creditsRemaining;
    }
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  executeCode,
  runTestCases,
  isAvailable,
  getStats,
  LANGUAGE_MAP,
};
