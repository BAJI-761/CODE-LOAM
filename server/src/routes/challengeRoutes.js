const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenOptional } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const challengeController = require('../controllers/challengeController');

router.get('/', verifyTokenOptional, challengeController.listChallenges);
router.get('/:id', challengeController.getChallenge);
router.post('/', verifyToken, roleCheck('instructor'), challengeController.createChallenge);
router.put('/:id', verifyToken, roleCheck('instructor'), challengeController.updateChallenge);
router.delete('/:id', verifyToken, roleCheck('instructor'), challengeController.deleteChallenge);

router.post('/:id/run', verifyToken, challengeController.runChallenge);
router.post('/:id/submit', verifyToken, challengeController.submitChallenge);
router.get('/:id/submissions', verifyToken, challengeController.getSubmissionHistory);

module.exports = router;
