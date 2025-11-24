const http = require('http');

// 1. Login
const loginData = JSON.stringify({
  email: 'admin@gmail.com',
  password: 'admin1234'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (res) => {
  console.log(`Login Status: ${res.statusCode}`);
  
  // Get cookies
  const cookies = res.headers['set-cookie'];
  console.log('Cookies received:', cookies);

  if (!cookies) {
    console.error('No cookies received! Session failed.');
    return;
  }

  // 2. Access Protected Route
  const protectedOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/admin/addNewResident', // or any protected route
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies // Send back the cookies
    }
  };

  const protectedReq = http.request(protectedOptions, (protRes) => {
    console.log(`Protected Route Status: ${protRes.statusCode}`);
    protRes.setEncoding('utf8');
    protRes.on('data', (chunk) => {
      console.log(`Protected Body: ${chunk}`);
    });
  });

  protectedReq.write(JSON.stringify({})); // Empty body, should trigger validation error (400) not 401/500
  protectedReq.end();
});

loginReq.write(loginData);
loginReq.end();
