const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const enrollmentController = require('../controllers/enrollmentController');

router.get('/my-courses', verifyToken, enrollmentController.getMyEnrollments);
router.post('/:courseId', verifyToken, enrollmentController.enrollInCourse);
router.get('/check/:courseId', verifyToken, enrollmentController.checkEnrollment);

module.exports = router;
