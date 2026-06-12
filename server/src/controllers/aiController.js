const asyncHandler = require('../utils/asyncHandler');
const aiService = require('../services/aiService');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const ChatHistory = require('../models/ChatHistory');
const CodingChallenge = require('../models/CodingChallenge');

exports.chat = asyncHandler(async (req, res) => {
  const { message, context } = req.body;
  if (!message) {
    throw new ApiError(400, 'Message is required');
  }

  const responseText = await aiService.askDoubtAssistant(req.user._id, message, context || {});
  
  res.status(200).json(new ApiResponse(200, { response: responseText }, 'AI response generated successfully'));
});

exports.getHistory = asyncHandler(async (req, res) => {
  const { referenceId, type } = req.query;
  const query = { student: req.user._id };
  if (type) query['context.type'] = type;
  if (referenceId) query['context.referenceId'] = referenceId;

  const historyDoc = await ChatHistory.findOne(query);

  res.status(200).json(new ApiResponse(200, historyDoc ? historyDoc.messages : [], 'Chat history retrieved'));
});

exports.getHint = asyncHandler(async (req, res) => {
  const { challengeId, code, language } = req.body;
  if (!challengeId || !code) {
    throw new ApiError(400, 'challengeId and code are required');
  }

  const challenge = await CodingChallenge.findById(challengeId);
  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }

  const hint = await aiService.getCodingHint(challenge, code);
  res.status(200).json(new ApiResponse(200, { hint }, 'Hint generated successfully'));
});

exports.explainError = asyncHandler(async (req, res) => {
  const { code, error, language } = req.body;
  if (!code || !error || !language) {
    throw new ApiError(400, 'code, error, and language are required');
  }

  const explanation = await aiService.explainError(code, error, language);
  res.status(200).json(new ApiResponse(200, { explanation }, 'Error explained successfully'));
});

exports.generateQuiz = asyncHandler(async (req, res) => {
  const { topic, difficulty = 'intermediate', questionCount = 5 } = req.body;
  if (!topic) {
    throw new ApiError(400, 'Topic is required');
  }

  const questions = await aiService.generateQuiz(topic, difficulty, questionCount);
  res.status(200).json(new ApiResponse(200, { questions }, 'Quiz generated successfully'));
});

exports.reviewCode = asyncHandler(async (req, res) => {
  const { code, language, challengeId } = req.body;
  if (!code || !language) {
    throw new ApiError(400, 'code and language are required');
  }

  let challengeDetails = null;
  if (challengeId) {
    challengeDetails = await CodingChallenge.findById(challengeId);
  }

  const review = await aiService.reviewCode(code, language, challengeDetails);
  res.status(200).json(new ApiResponse(200, { review }, 'Code reviewed successfully'));
});

exports.getStatus = asyncHandler(async (req, res) => {
  const isAIAvailable = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 20;
  
  res.status(200).json(new ApiResponse(200, { 
    available: isAIAvailable,
    demoMode: !isAIAvailable,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  }));
});