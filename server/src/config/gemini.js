/**
 * Gemini AI Configuration
 * Initializes the Google Generative AI client or returns null if unconfigured.
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let isAvailable = false;

function initGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length <= 20 || apiKey.includes('your_api_key_here')) {
    console.warn('⚠️  Gemini API key not set or invalid — AI will use mock responses');
    return;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    isAvailable = true;
  } catch (err) {
    console.warn('⚠️  Failed to initialize Gemini:', err.message);
  }
}

function getModel() {
  if (!genAI) return null;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  return genAI.getGenerativeModel({ model: modelName });
}

function isGeminiAvailable() {
  return isAvailable;
}

module.exports = { initGemini, getModel, isGeminiAvailable };
