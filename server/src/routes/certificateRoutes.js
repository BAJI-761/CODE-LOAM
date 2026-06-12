const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { verifyToken } = require('../middleware/auth');

router.get('/verify/:id', certificateController.verifyCertificate);

router.use(verifyToken);
router.get('/', certificateController.getCertificates);
router.get('/:id', certificateController.getCertificateById);
router.post('/generate/:courseId', certificateController.generateCertificate);

module.exports = router;
