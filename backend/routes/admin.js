const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const passport = require('passport');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes (no authentication required)
// POST /admin/create-account - Create new society account
router.post('/create-account', adminController.createSocietyAccount);

// POST /admin/login - Admin login
router.post('/login', adminController.adminLogin);

// POST /admin/resident-login - Resident login (placed under admin for legacy routing)
router.post('/resident-login', adminController.residentLogin);

// Protected routes (require admin authentication)
// Society Management
router.get('/societies', authenticateAdmin, adminController.getAllSocieties);
router.get('/societies/:id', authenticateAdmin, adminController.getSocietyById);
router.put('/societies/:id', authenticateAdmin, adminController.updateSociety);
router.delete('/societies/:id', authenticateAdmin, adminController.deleteSociety);

// Admin Session
router.post('/logout', authenticateAdmin, adminController.adminLogout);

// Resident Management
router.post('/addNewResident', authenticateAdmin, adminController.addNewResident);
router.get('/residents', authenticateAdmin, adminController.getResidents);
router.delete('/residents/:id', authenticateAdmin, adminController.deleteResident);

// Bill Management
router.post('/createBill', authenticateAdmin, adminController.createBill);
router.get('/payments', authenticateAdmin, adminController.getPayments);
router.put('/payments/mark/:id', authenticateAdmin, adminController.markPaymentAsPaid);

// Employee Management
router.post('/addNewEmployee', authenticateAdmin, adminController.addNewEmployee);
router.get('/employees', authenticateAdmin, adminController.getEmployees);

// Parking
router.get('/parking', authenticateAdmin, adminController.getParking);

// Complaints
router.get('/complaints', authenticateAdmin, adminController.getComplaints);
router.put('/complaints/:id/status', authenticateAdmin, adminController.updateComplaintStatus);

module.exports = router;
