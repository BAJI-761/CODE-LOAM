const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenOptional } = require('../middleware/auth');
const leaderboardController = require('../controllers/leaderboardController');

router.get('/', verifyTokenOptional, leaderboardController.getLeaderboard);
router.get('/me', verifyToken, leaderboardController.getMyRank);

module.exports = router;
