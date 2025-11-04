const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

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

module.exports = router;
