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

module.exports = router;
