const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const ApiError = require('./utils/ApiError');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter, aiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply general rate limiter to all requests
app.use('/api', generalLimiter);

// Root Route (helps prevent 404 logs from pinging services like Render)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CodeLoom API is running' });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes Mounting
const authRoutes = require('./routes/authRoutes');
app.use('/api/v1/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/users', userRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/v1/uploads', uploadRoutes);

const courseRoutes = require('./routes/courseRoutes');
app.use('/api/v1/courses', courseRoutes);

const instructorRoutes = require('./routes/instructorRoutes');
app.use('/api/v1/instructor', instructorRoutes);

const challengeRoutes = require('./routes/challengeRoutes');
app.use('/api/v1/challenges', challengeRoutes);

const quizRoutes = require('./routes/quizRoutes');
app.use('/api/v1/quizzes', quizRoutes);

const enrollmentRoutes = require('./routes/enrollmentRoutes');
app.use('/api/v1/enrollments', enrollmentRoutes);

const certificateRoutes = require('./routes/certificateRoutes');
app.use('/api/v1/certificates', certificateRoutes);

const progressRoutes = require('./routes/progressRoutes');
app.use('/api/v1/progress', progressRoutes);

const leaderboardRoutes = require('./routes/leaderboardRoutes');
app.use('/api/v1/leaderboard', leaderboardRoutes);

const assignmentRoutes = require('./routes/assignmentRoutes');
app.use('/api/v1/assignments', assignmentRoutes);

const aiRoutes = require('./routes/aiRoutes');
// Apply stricter rate limiter specifically for AI routes
app.use('/api/v1/ai', aiLimiter, aiRoutes);

// Handle 404 (Not Found)
app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
