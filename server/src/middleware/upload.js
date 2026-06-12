const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// If cloudinary isn't configured, use a memory storage (or just disk) to discard the file
// as we'll return placeholders anyway.
const fallbackStorage = multer.memoryStorage();

const imageStorage = isCloudinaryConfigured()
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'codeloom/thumbnails',
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      },
    })
  : fallbackStorage;

const videoStorage = isCloudinaryConfigured()
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'codeloom/videos',
        resource_type: 'video',
        allowedFormats: ['mp4', 'mov', 'webm'],
      },
    })
  : fallbackStorage;

const imageUpload = multer({ storage: imageStorage });
const videoUpload = multer({ storage: videoStorage });

module.exports = {
  imageUpload,
  videoUpload,
};
