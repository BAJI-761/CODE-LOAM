require('dotenv').config();
const dns = require('dns');
// Override DNS to bypass local network DNS blocks on Node.js UDP queries
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const { validateEnv } = require('./src/config/env');
const { initCloudinary } = require('./src/config/cloudinary');
const { initGemini } = require('./src/config/gemini');

// Validate environment variables first
validateEnv();

// Initialize external services
initCloudinary();
initGemini();

const app = require('./src/app');
const PORT = process.env.PORT || 5000;

const connectToMongoDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set — falling back to in-memory MongoDB');
  } else {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB Atlas');
      return; // Successfully connected
    } catch (err) {
      console.error('❌ MongoDB Atlas connection failed:', err.message);
      console.warn('⚠️  Falling back to in-memory MongoDB');
    }
  }

  // Fallback to in-memory
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log('✅ Connected to in-memory MongoDB at', memUri);
    console.log('   ⚠️  Data will NOT persist across restarts.');
    
    // Seed the database
    const seedDatabase = require('./seed');
    console.log('🌱 Seeding in-memory database for smoke tests...');
    await seedDatabase();
  } catch (memError) {
    console.error('❌ Failed to start in-memory MongoDB:', memError.message);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectToMongoDB();

    // Start Express server
    app.listen(PORT, () => {
      // console.log(`🚀 Server is running on port ${PORT}`); // Already logged in validateEnv
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
