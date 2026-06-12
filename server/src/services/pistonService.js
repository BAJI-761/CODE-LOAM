/* 
// DEPRECATED: Replaced by oneCompilerService
const axios = require('axios');

function getPistonClient() {
  const baseURL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';
  return axios.create({
    baseURL,
    timeout: 15000,
  });
}

const LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0', fileName: 'main.js' },
  python: { language: 'python', version: '3.10.0', fileName: 'main.py' },
  cpp: { language: 'c++', version: '10.2.0', fileName: 'main.cpp' },
  java: { language: 'java', version: '15.0.2', fileName: 'Main.java' },
};

async function executeCode({ sourceCode, language, stdin }) {
  const config = LANGUAGE_MAP[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const client = getPistonClient();
  
  try {
    const response = await client.post('/execute', {
      language: config.language,
      version: config.version,
      files: [
        {
          name: config.fileName,
          content: sourceCode
        }
      ],
      stdin: stdin || ""
    });

    return {
      error: false,
      run: response.data.run,
      compile: response.data.compile,
      message: response.data.message
    };
  } catch (error) {
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        return { error: true, message: error.response.data.message, run: { stderr: error.response.data.message } };
      }
      return { error: true, message: `Piston API Error: ${error.response.status} ${error.response.statusText}`, run: { stderr: `Piston API Error: ${error.response.status} ${error.response.statusText}` } };
    } else if (error.request) {
      return { error: true, message: 'Piston API Error: Timeout or Network failure', run: { stderr: 'Piston API Error: Timeout or Network failure' } };
    } else {
      return { error: true, message: `Execution setup error: ${error.message}`, run: { stderr: `Execution setup error: ${error.message}` } };
    }
  }
}

module.exports = {
  executeCode,
};
*/
