const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { verifyToken } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.use(verifyToken);

router.post('/', roleCheck('instructor', 'admin'), quizController.createQuiz);
router.get('/course/:courseId', quizController.getQuizzesByCourse);
router.get('/:id', quizController.getQuiz);
router.post('/:id/attempt', quizController.submitAttempt);
router.get('/:id/results', quizController.getResults);

module.exports = router;
