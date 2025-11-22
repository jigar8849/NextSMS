const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const passport = require('passport');

// Middleware to check if admin is authenticated
const isAuthenticated = (req, res, next) => {
  console.log('isAuthenticated check:', {
    isAuthenticated: req.isAuthenticated(),
    user: req.user ? { id: req.user._id, modelName: req.user.constructor.modelName } : null
  });
  if (req.isAuthenticated() && req.user.constructor.modelName === 'SocitySetUp') {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
};

// POST /admin/create-account - Create new society account
router.post('/create-account', adminController.createSocietyAccount);

// GET /admin/societies - Get all societies
router.get('/societies', adminController.getAllSocieties);

// GET /admin/societies/:id - Get society by ID
router.get('/societies/:id', adminController.getSocietyById);

// PUT /admin/societies/:id - Update society
router.put('/societies/:id', adminController.updateSociety);

// DELETE /admin/societies/:id - Delete society
router.delete('/societies/:id', adminController.deleteSociety);

// POST /admin/login - Admin login
router.post('/login', adminController.adminLogin);

// POST /admin/logout - Admin logout
router.post('/logout', adminController.adminLogout);

router.post('/addNewResident', adminController.addNewResident);

// POST /admin/createBill - Create bill template
router.post('/createBill', adminController.createBill);

// POST /resident-login - Resident login
router.post('/resident-login', adminController.residentLogin);

router.post('/addNewEmployee',  adminController.addNewEmployee);

router.get('/employees', adminController.getEmployees);

router.get('/api/residents', adminController.getResidents);

router.delete('/residents/:id', adminController.deleteResident);

router.get('/parking', adminController.getParking);

router.get('/complaints', adminController.getComplaints);

router.put('/complaints/:id/status', adminController.updateComplaintStatus);

router.get('/payments', adminController.getPayments);

router.get('/payments/mark/:id', adminController.markPaymentAsPaid);

module.exports = router;
