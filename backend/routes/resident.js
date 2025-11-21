const express = require('express');
const router = express.Router();
const { authenticateResident } = require('../middleware/auth');

// Temporarily remove authentication for testing
// const { authenticateResident } = require('../middleware/auth');
const {
  addComplaint,
  getComplaints,
  addEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getParking,
  getEmployees,
  getBills,
  createPaymentOrder,
  verifyPayment,
} = require('../controllers/residentController');

// Complaints routes
router.post('/complaints', addComplaint); // Temporarily remove auth for testing
router.get('/complaints', getComplaints); // Temporarily remove auth for testing

// Events routes
router.post('/events', addEvent); // Temporarily remove auth for testing
router.get('/events', getEvents); // No auth for viewing
router.put('/events/:id', authenticateResident, updateEvent);
router.delete('/events/:id', authenticateResident, deleteEvent);

// Parking routes
router.get('/parking', getParking); // Temporarily remove auth for testing

// Employees routes
router.get('/employees', getEmployees); // Temporarily remove auth for testing

// Bills routes
router.get('/bills', authenticateResident, getBills);

// Payment routes
router.post('/payment/order', authenticateResident, createPaymentOrder);
router.post('/payment/verify', authenticateResident, verifyPayment);

module.exports = router;
