const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Public
router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourse);

// Student
router.get('/:id/learn', verifyToken, courseController.getCourseForLearning);
router.put('/:id/progress', verifyToken, courseController.updateProgress);

module.exports = router;
