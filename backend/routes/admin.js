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

// POST /admin/addNewResident - Add new resident
router.post('/addNewResident', isAuthenticated, adminController.addNewResident);

// POST /admin/createBill - Create bill template
router.post('/createBill', adminController.createBill);

// POST /resident-login - Resident login
router.post('/resident-login', adminController.residentLogin);

// POST /admin/addNewEmployee - Add new employee
router.post('/addNewEmployee',  adminController.addNewEmployee);

// GET /admin/employees - Get all employees for the logged-in admin's society
router.get('/employees', isAuthenticated, adminController.getEmployees);

// GET /admin/api/residents - Get all residents for the logged-in admin's society
router.get('/api/residents', isAuthenticated, adminController.getResidents);

// DELETE /admin/residents/:id - Delete a resident by ID
router.delete('/residents/:id', isAuthenticated, adminController.deleteResident);

// GET /admin/parking - Get parking data for the logged-in admin's society
router.get('/parking', isAuthenticated, adminController.getParking);

module.exports = router;
