const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/overview', progressController.getOverview);
router.get('/course/:courseId', progressController.getCourseProgress);
router.get('/challenges', progressController.getChallengeProgress);

module.exports = router;
