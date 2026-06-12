const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.use(verifyToken);

router.post('/chat', aiController.chat);
router.get('/chat/history', aiController.getHistory);
router.get('/status', aiController.getStatus);
router.post('/hint', aiController.getHint);
router.post('/explain-error', aiController.explainError);
router.post('/review', aiController.reviewCode);
router.post('/generate-quiz', roleCheck('instructor', 'admin'), aiController.generateQuiz);

module.exports = router;
