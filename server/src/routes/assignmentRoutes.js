const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const assignmentController = require('../controllers/assignmentController');

router.get('/course/:courseId', verifyToken, assignmentController.getAssignmentsByCourse);
router.post('/', verifyToken, roleCheck('instructor'), assignmentController.createAssignment);
router.post('/:id/submit', verifyToken, assignmentController.submitAssignment);

module.exports = router;
