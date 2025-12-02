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
const MongoStore = require('connect-mongo'); // IMPORTANT: Add this package
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Added imports
const favicon = require('serve-favicon');
const path = require('path');

// Import middleware
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { PASSPORT_STRATEGIES, MODEL_NAMES } = require('./config/constants');

// Import routes
const adminRoutes = require('./routes/admin');
const residentRoutes = require('./routes/resident');

const app = express();

// REQUIRED for Render reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API servers
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Add favicon
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// ========== CORS CONFIGURATION ==========
const allowedOrigins = [
  "https://next-sms-frontend-6mwm.vercel.app",
  "https://next-sms-ten.vercel.app",
  "http://localhost:3000" // For local development
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  exposedHeaders: ['set-cookie'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));

// Handle preflight requests
app.options('*', cors());

// ========== SESSION CONFIGURATION ==========
// Create MongoStore instance
const mongoStore = MongoStore.create({
  mongoUrl: config.mongoUri,
  collectionName: 'sessions',
  ttl: 24 * 60 * 60, // 1 day in seconds
  autoRemove: 'native'
});

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  proxy: true, // REQUIRED for HTTPS (Render)
  cookie: {
    secure: true, // MUST be true in production for HTTPS
    httpOnly: true,
    sameSite: 'none', // MUST be 'none' for cross-origin in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/',
    // domain: 'vercel.app' // Don't set domain unless you own it
  },
  name: 'sms_session' // Custom session cookie name
}));

// ========== PASSPORT CONFIGURATION ==========
app.use(passport.initialize());
app.use(passport.session());

const SocitySetUp = require('./models/socitySetUp');
const NewMember = require('./models/newMember');

// Society authentication strategy
passport.use(PASSPORT_STRATEGIES.SOCIETY, new LocalStrategy({ 
  usernameField: 'email' 
}, SocitySetUp.authenticate()));

// Resident authentication strategy
passport.use(PASSPORT_STRATEGIES.RESIDENT, new LocalStrategy({ 
  usernameField: 'email' 
}, NewMember.authenticate()));

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, { 
    id: user._id, 
    type: user.constructor.modelName,
    email: user.email 
  });
});

// Deserialize user from session
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
    
    const user = await UserModel.findById(id).select('-password');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ========== DEBUG ENDPOINTS (Remove in Production if needed) ==========
app.get('/debug/session', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    session: req.session,
    cookies: req.headers.cookie,
    user: req.user || 'No user'
  });
});

app.get('/debug/cookies', (req, res) => {
  // Set a test cookie
  res.cookie('debug_test', 'test_value_' + Date.now(), {
    httpOnly: false, // Visible in JavaScript for debugging
    secure: true,
    sameSite: 'none',
    maxAge: 3600000,
    path: '/'
  });
  
  res.json({
    message: 'Debug endpoint',
    cookies_sent: req.headers.cookie || 'No cookies sent',
    session_id: req.sessionID,
    origin: req.headers.origin,
    user_agent: req.headers['user-agent']
  });
});

// ========== ROUTES ==========
app.use('/admin', adminRoutes);
app.use('/resident', residentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Server is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    session: {
      id: req.sessionID,
      exists: !!req.session
    },
    cors: {
      origins: allowedOrigins
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SMS Backend API',
    version: '1.0.0',
    docs: 'Coming soon...',
    health: '/health',
    debug: '/debug/session'
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// ========== DATABASE CONNECTION ==========
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✓ Connected to MongoDB');
  console.log(`✓ Environment: ${config.nodeEnv}`);
  console.log(`✓ Port: ${config.port}`);
  console.log(`✓ Session Secret: ${config.sessionSecret ? 'Set' : 'Not Set'}`);
  console.log(`✓ CORS Origins:`);
  allowedOrigins.forEach(origin => console.log(`  - ${origin}`));
  
  app.listen(config.port, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Server Started Successfully!');
    console.log('='.repeat(50));
    console.log(`📡 Server URL: http://localhost:${config.port}`);
    console.log(`🌐 Public URL: (Your Render/Server URL)`);
    console.log(`🖥️  Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`🍪 Session Cookie: sms_session`);
    console.log(`🔒 Secure: true (HTTPS only)`);
    console.log(`🎯 SameSite: none (Cross-origin enabled)`);
    console.log(`📊 Session Store: MongoDB`);
    console.log('='.repeat(50));
    console.log('\n📋 Test Endpoints:');
    console.log(`   Health:   ${process.env.FRONTEND_URL ? 'https://' + process.env.FRONTEND_URL.split('//')[1] : 'Your server'}/health`);
    console.log(`   Debug:    ${process.env.FRONTEND_URL ? 'https://' + process.env.FRONTEND_URL.split('//')[1] : 'Your server'}/debug/cookies`);
    console.log('='.repeat(50));
  });
})
.catch((err) => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});

module.exports = app;