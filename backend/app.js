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

// Import routes
const adminRoutes = require('./routes/admin');
const residentRoutes = require('./routes/resident');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.isProduction
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging middleware
app.use(requestLogger);

// Session configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.isProduction, // Use secure cookies in production
    httpOnly: true,
    sameSite: config.isProduction ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
const SocitySetUp = require('./models/socitySetUp');
const NewMember = require('./models/newMember');
passport.use(PASSPORT_STRATEGIES.SOCIETY, new LocalStrategy({ usernameField: 'email' }, SocitySetUp.authenticate()));
passport.use(PASSPORT_STRATEGIES.RESIDENT, new LocalStrategy({ usernameField: 'email' }, NewMember.authenticate()));
passport.serializeUser((user, done) => {
  done(null, { id: user._id, type: user.constructor.modelName });
});
passport.deserializeUser(async (serializedUser, done) => {
  try {
    const { id, type } = serializedUser;
    let UserModel;
    if (type === MODEL_NAMES.SOCIETY) {
      UserModel = SocitySetUp;
    } else if (type === MODEL_NAMES.RESIDENT) {
      UserModel = NewMember;
    } else {
      return done(new Error('Unknown user type'));
    }
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

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

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✓ Connected to MongoDB');
  console.log(`✓ Environment: ${config.nodeEnv}`);
  app.listen(config.port, () => {
    console.log(`✓ Server running on port ${config.port}`);
    console.log(`✓ Frontend URL: ${config.frontendUrl}`);
  });
})
.catch((err) => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});

module.exports = app;
