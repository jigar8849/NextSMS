// Load environment variables first
require('dotenv').config();

// Validate environment and load config
const config = require('./config/env');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Import middleware
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { PASSPORT_STRATEGIES, MODEL_NAMES } = require('./config/constants');

// Import models
const SocitySetUp = require('./models/socitySetUp');
const NewMember = require('./models/newMember');

// Import routes
const adminRoutes = require('./routes/admin');
const residentRoutes = require('./routes/resident');

const app = express();

// REQUIRED for Render reverse proxy & secure cookies
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.isProduction
}));
app.use(compression());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));

// CORS configuration (Must match frontend deployed domain)
app.use(cors({
  origin: [
    "https://nextsms-1.onrender.com",
    "https://nextsms.onrender.com"
  ],
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Session middleware (MUST be before passport & logging)
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: true, // HTTPS required on Render
    httpOnly: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(PASSPORT_STRATEGIES.SOCIETY,
  new LocalStrategy({ usernameField: 'email' }, SocitySetUp.authenticate())
);
passport.use(PASSPORT_STRATEGIES.RESIDENT,
  new LocalStrategy({ usernameField: 'email' }, NewMember.authenticate())
);

passport.serializeUser((user, done) => {
  done(null, { id: user._id, type: user.constructor.modelName });
});

passport.deserializeUser(async (serializedUser, done) => {
  try {
    const { id, type } = serializedUser;
    const Model = (type === MODEL_NAMES.SOCIETY) 
      ? SocitySetUp 
      : NewMember;

    const user = await Model.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Logger (after session so req.user is logged properly)
app.use(requestLogger);

// Routes
app.use('/admin', adminRoutes);
app.use('/resident', residentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// MongoDB Connect & Start Server
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✓ Connected to MongoDB');
  console.log(`✓ Environment: ${config.nodeEnv}`);
  app.listen(config.port, () => {
    console.log(`✓ Server running on port ${config.port}`);
    console.log(`🌍 Running with cookies & session authentication`);
  });
})
.catch((err) => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});

module.exports = app;
