const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const resourcesRoutes = require('./routes/resourcesRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postsRoutes = require('./routes/postsRoutes');
const { errorHandler, notFound, errorLogger } = require('./middleware/errorMiddleware');

const app = express();

// Security and utility Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174').split(',');
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
// Increase limits for base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/posts', postsRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'CampusConnect API Gateway active.' });
});

// Error handling
app.use(notFound);
app.use(errorLogger);
app.use(errorHandler);

module.exports = app;
