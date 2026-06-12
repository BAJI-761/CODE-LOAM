/**
 * Environment Variable Validation Module
 * Validates all required env vars on startup and logs clean status.
 */

const REQUIRED_VARS = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
];

const OPTIONAL_SERVICES = {
  cloudinary: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
  gemini: ['GEMINI_API_KEY'],
  oneCompiler: ['ONECOMPILER_API_KEY'],
};

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  const status = {
    mongodb: !!process.env.MONGODB_URI,
    cloudinary: OPTIONAL_SERVICES.cloudinary.every((k) => !!process.env[k]),
    gemini: !!process.env.GEMINI_API_KEY,
    oneCompiler: !!process.env.ONECOMPILER_API_KEY,
    jwtValid: (process.env.JWT_SECRET || '').length >= 32,
  };

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║       CodeLoom — Environment Check       ║');
  console.log('╚══════════════════════════════════════════╝');

  if (missing.length > 0) {
    console.error(`❌ Missing required variables: ${missing.join(', ')}`);
    console.error('   Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }

  console.log('✅ Required environment variables present');
  console.log(status.mongodb ? '✅ MongoDB configured' : '⚠️  MongoDB URI not set — will use in-memory');
  console.log(status.cloudinary ? '✅ Cloudinary configured' : '⚠️  Cloudinary not configured — file uploads will use placeholder URLs');
  console.log(status.gemini ? '✅ Gemini AI configured' : '⚠️  Gemini API key missing — AI features will use mock responses');
  console.log(status.jwtValid ? '✅ JWT secret valid' : '⚠️  JWT secret too short (min 32 chars)');

  if (status.oneCompiler) {
    console.log('✅ OneCompiler API configured');
    
    // Async health check
    const oneCompilerService = require('../services/oneCompilerService');
    oneCompilerService.isAvailable().then(ok => {
      if (ok) {
        console.log('✅ OneCompiler API reachable');
        const stats = oneCompilerService.getStats();
        if (stats.lastKnownRemaining !== null) {
          console.log(`📊 OneCompiler credits remaining: ${stats.lastKnownRemaining}`);
        }
      } else {
        console.warn('⚠️ OneCompiler API unreachable — code execution will fail');
      }
    });
  } else {
    console.warn('⚠️ ONECOMPILER_API_KEY missing — code execution disabled');
  }

  console.log(`🚀 Server starting on port ${process.env.PORT || 5000}`);
  console.log('');

  return status;
}

module.exports = { validateEnv };
