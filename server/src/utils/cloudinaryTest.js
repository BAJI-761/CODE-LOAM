const cloudinary = require('../config/cloudinary');

async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fill/sample.jpg',
      { folder: 'codeloom_test' }
    );
    console.log('Upload successful:', result.secure_url);
  } catch (err) {
    console.error('Upload failed:', err.message || err);
    process.exitCode = 2;
  }
}

if (require.main === module) {
  testUpload();
}

module.exports = testUpload;
