/**
 * Request Logger Middleware
 * Logs all incoming requests with timestamp, method, endpoint, and status
 */

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log the incoming request
  console.log('\n════════════════════════════════════════');
  console.log('🎯 ENDPOINT HIT');
  console.log(`📅 Time: ${new Date().toLocaleString()}`);
  console.log(`🔵 Method: ${req.method}`);
  console.log(`🌐 Endpoint: ${req.originalUrl || req.url}`);
  console.log(`📍 Base URL: ${req.baseUrl}`);
  console.log(`🔗 Path: ${req.path}`);
  console.log(`💻 IP: ${req.ip || req.connection.remoteAddress}`);
  
  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log(`❓ Query Params:`, req.query);
  }
  
  // Log request body if present (excluding sensitive data)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields from logs
    if (sanitizedBody.password) sanitizedBody.password = '***';
    if (sanitizedBody.token) sanitizedBody.token = '***';
    console.log(`📦 Body:`, sanitizedBody);
  }
  
  // Capture the original res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function(body) {
    const duration = Date.now() - startTime;
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log('════════════════════════════════════════\n');
    return originalJson(body);
  };
  
  // Also capture response end for non-JSON responses
  const originalEnd = res.end.bind(res);
  res.end = function(...args) {
    if (!res.headersSent || res.getHeader('Content-Type')?.includes('application/json')) {
      return originalEnd(...args);
    }
    const duration = Date.now() - startTime;
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log('════════════════════════════════════════\n');
    return originalEnd(...args);
  };
  
  next();
};

module.exports = requestLogger;
