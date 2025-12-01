/**
 * Environment Variable Validation and Configuration
 * Validates required environment variables and exports typed configuration
 */

const requiredEnvVars = [
  'MONGO_URI',
  'SESSION_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET'
];

const optionalEnvVars = {
  PORT: '5000',
  NODE_ENV: 'development',
  FRONTEND_URL: 'https://next-sms-frontend-6mwm.vercel.app'
};

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
function validateEnv() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

/**
 * Get configuration value with fallback to default
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not set
 * @returns {string} Configuration value
 */
function getConfig(key, defaultValue) {
  return process.env[key] || defaultValue;
}

// Validate environment on module load
validateEnv();

// Export validated and typed configuration
module.exports = {
  // Server Configuration
  port: parseInt(getConfig('PORT', optionalEnvVars.PORT), 10),
  nodeEnv: getConfig('NODE_ENV', optionalEnvVars.NODE_ENV),
  isProduction: getConfig('NODE_ENV', optionalEnvVars.NODE_ENV) === 'production',
  isDevelopment: getConfig('NODE_ENV', optionalEnvVars.NODE_ENV) === 'development',
  
  // Database Configuration
  mongoUri: process.env.MONGO_URI,
  
  // Session Configuration
  sessionSecret: process.env.SESSION_SECRET,
  
  // Frontend Configuration
  frontendUrl: getConfig('FRONTEND_URL', optionalEnvVars.FRONTEND_URL),
  
  // Payment Configuration
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET
  }
};
