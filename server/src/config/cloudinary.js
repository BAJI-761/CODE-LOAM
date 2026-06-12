/**
 * Cloudinary Configuration
 * Falls back to placeholder URLs when credentials are missing.
 */
const cloudinary = require('cloudinary').v2;

let isConfigured = false;

function initCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
    isConfigured = true;
  }
}

function isCloudinaryConfigured() {
  return isConfigured;
}

function getPlaceholderImageUrl(seed) {
  return `https://picsum.photos/seed/${seed || 'codeloom'}/800/450`;
}

function getPlaceholderVideoUrl() {
  return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
}

module.exports = {
  cloudinary,
  initCloudinary,
  isCloudinaryConfigured,
  getPlaceholderImageUrl,
  getPlaceholderVideoUrl,
};
