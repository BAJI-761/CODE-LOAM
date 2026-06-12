const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.use(verifyToken, roleCheck('instructor'));

router.get('/dashboard/stats', courseController.getDashboardStats);

router.post('/courses', courseController.createCourse);
router.get('/courses', courseController.listInstructorCourses);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

// Modules
router.post('/courses/:id/modules', courseController.addModule);
router.put('/courses/:id/modules/:moduleIndex', courseController.updateModule);
router.delete('/courses/:id/modules/:moduleIndex', courseController.removeModule);

// Lessons
router.post('/courses/:id/modules/:moduleIndex/lessons', courseController.addLesson);
router.delete('/courses/:id/modules/:moduleIndex/lessons/:lessonIndex', courseController.removeLesson);

// Analytics & Students
router.get('/courses/:id/analytics', courseController.getCourseAnalytics);
router.get('/students', courseController.getInstructorStudents);

module.exports = router;
