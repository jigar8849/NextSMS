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

router.post('/events', addEvent); // Temporarily remove auth for testing
router.get('/events', getEvents); // No auth for viewing
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Parking routes
router.get('/parking', getParking); // Temporarily remove auth for testing

// Employees routes
router.get('/employees', getEmployees); // Temporarily remove auth for testing

router.get('/bills', getBills);

// Payment routes
router.post('/payment/order', createPaymentOrder);
router.post('/payment/verify', verifyPayment);

module.exports = router;
