const express = require('express');
const router = express.Router();
const { authenticateResident, optionalAuth } = require('../middleware/auth');
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
   getProfile,
  updateProfile,
  addFamilyMember,
  addVehicle,
  updateVehicle,
  deleteFamilyMember,
} = require('../controllers/residentController');

// Complaints routes (require authentication)
router.post('/complaints', authenticateResident, addComplaint);
router.get('/complaints', authenticateResident, getComplaints);

// Event routes
router.post('/events', authenticateResident, addEvent);
router.get('/events', getEvents); // No auth - anyone can view events
router.put('/events/:id', authenticateResident, updateEvent);
router.delete('/events/:id', authenticateResident, deleteEvent);

// Parking routes (require authentication)
router.get('/parking', authenticateResident, getParking);

// Employees routes (require authentication)
router.get('/employees', authenticateResident, getEmployees);

// Bills routes (require authentication)
router.get('/bills', authenticateResident, getBills);

// Payment routes (require authentication)
router.post('/payment/order', authenticateResident, createPaymentOrder);
router.post('/payment/verify', authenticateResident, verifyPayment);

// Profile routes (require authentication)
router.get('/profile', authenticateResident, getProfile);
router.put('/profile', authenticateResident, updateProfile);
router.post('/family', authenticateResident, addFamilyMember);
router.delete('/family/:index', authenticateResident, deleteFamilyMember);
router.post('/vehicles', authenticateResident, addVehicle);
router.put('/vehicles/:id', authenticateResident, updateVehicle);

module.exports = router;

