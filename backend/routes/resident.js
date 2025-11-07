const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const passport = require('passport');

// Middleware to check if resident is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user.constructor.modelName === 'NewMember') {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
};

// POST /resident/api/complaints - Add new complaint
router.post('/api/complaints', residentController.addComplaint);

// POST /resident/api/events - Add new event
router.post('/api/events', residentController.addEvent);

// GET /resident/parking - Get parking data for the logged-in resident's society
router.get('/parking', isAuthenticated, residentController.getParking);

// GET /resident/employees - Get employees data for the logged-in resident's society
router.get('/employees', isAuthenticated, residentController.getEmployees);

module.exports = router;
