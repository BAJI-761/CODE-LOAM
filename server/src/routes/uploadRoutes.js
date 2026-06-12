const express = require('express');
const router = express.Router();
const { imageUpload, videoUpload } = require('../middleware/upload');
const { isCloudinaryConfigured, getPlaceholderImageUrl, getPlaceholderVideoUrl } = require('../config/cloudinary');

// Single image upload (thumbnail)
router.post('/thumbnail', imageUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  
  if (isCloudinaryConfigured()) {
    return res.status(201).json({ success: true, url: req.file.path || req.file.url || req.file.secure_url });
  }

  // Fallback
  res.status(201).json({ success: true, url: getPlaceholderImageUrl(Date.now().toString()) });
});

// Single video upload
router.post('/video', videoUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  
  if (isCloudinaryConfigured()) {
    return res.status(201).json({ success: true, url: req.file.path || req.file.url || req.file.secure_url });
  }

  // Fallback
  res.status(201).json({ success: true, url: getPlaceholderVideoUrl() });
});

module.exports = router;
