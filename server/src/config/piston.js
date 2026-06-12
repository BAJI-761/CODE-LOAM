/**
 * Piston Code Execution API Configuration
 */
const axios = require('axios');

const LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  cpp: { language: 'c++', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
};

function getPistonClient() {
  const baseURL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';
  return axios.create({
    baseURL,
    timeout: 15000,
  });
}

module.exports = { getPistonClient, LANGUAGE_MAP };
