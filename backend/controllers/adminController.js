const SocitySetUp = require('../models/socitySetUp');
const NewMember = require('../models/newMember');
const mongoose = require('mongoose');

// Create society account (admin registration)
const createSocietyAccount = async (req, res) => {
  try {
    const {
      socity_name,
      socity_address,
      city,
      state,
      pincode,
      total_block,
      total_floor,
      total_flat,
      house_per_level,
      total_four_wheeler_slot,
      total_two_wheeler_slot,
      admin_name,
      phone,
      email,
      password,
      confirm_password
    } = req.body;

    // Validation
    if (!socity_name || !email || !password || !confirm_password) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if admin email already exists
    const existingAdmin = await SocitySetUp.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ error: 'Admin with this email already exists' });
    }

    // Create new society admin
    const newSociety = new SocitySetUp({
      socity_name,
      socity_address,
      city,
      state,
      pincode,
      total_block,
      total_floor,
      total_flat,
      house_per_level,
      total_four_wheeler_slot,
      total_two_wheeler_slot,
      admin_name,
      phone,
      email
    });

    // Register with passport-local-mongoose (handles password hashing)
    await SocitySetUp.register(newSociety, password);

    // Fetch the created document to get the ID
    const createdSociety = await SocitySetUp.findOne({ email });

    res.status(201).json({
      ok: true,
      message: 'Society account created successfully',
      id: createdSociety._id
    });

  } catch (error) {
    console.error('Error creating society account:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    if (error.name === 'UserExistsError') {
      return res.status(409).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all societies (for admin management, if needed)
const getAllSocieties = async (req, res) => {
  try {
    const societies = await SocitySetUp.find({}, '-salt -hash'); // Exclude password fields
    res.status(200).json({ societies });
  } catch (error) {
    console.error('Error fetching societies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get society by ID
const getSocietyById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid society ID' });
    }

    const society = await SocitySetUp.findById(id, '-salt -hash');
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    res.status(200).json({ society });
  } catch (error) {
    console.error('Error fetching society:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update society details
const updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid society ID' });
    }

    const updateData = req.body;
    // Remove password fields from update if present (password updates should be separate)
    delete updateData.password;
    delete updateData.confirm_password;

    const updatedSociety = await SocitySetUp.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true, select: '-salt -hash' }
    );

    if (!updatedSociety) {
      return res.status(404).json({ error: 'Society not found' });
    }

    res.status(200).json({
      message: 'Society updated successfully',
      society: updatedSociety
    });
  } catch (error) {
    console.error('Error updating society:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete society
const deleteSociety = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid society ID' });
    }

    const deletedSociety = await SocitySetUp.findByIdAndDelete(id);
    if (!deletedSociety) {
      return res.status(404).json({ error: 'Society not found' });
    }

    res.status(200).json({ message: 'Society deleted successfully' });
  } catch (error) {
    console.error('Error deleting society:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const passport = require('passport');

const adminLogin = async (req, res, next) => {
  passport.authenticate('society-local', (err, user, info) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Invalid credentials.' });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Login session error:', err);
        return res.status(500).json({ error: 'Login failed.' });
      }

      res.status(200).json({
        message: 'Login successful.',
        redirect: '/admin/dashboard',
        user: {
          id: user._id,
          email: user.email,
          socity_name: user.socity_name,
          admin_name: user.admin_name,
        },
      });
    });
  })(req, res, next);
};

// Add new resident member
const addNewResident = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      birth_date,
      mobile_number,
      emergency_number,
      number_of_member,
      name_of_each_member,
      block,
      floor_number,
      flat_number,
      email,
      create_password,
      two_wheeler,
      four_wheeler,
      status = 'active',
      role = 'resident'
    } = req.body;

    // Validation
    if (!first_name || !last_name || !email || !create_password) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    if (create_password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if resident email already exists
    const existingResident = await NewMember.findOne({ email });
    if (existingResident) {
      return res.status(409).json({ error: 'Resident with this email already exists' });
    }

    // Create new resident
    const newResident = new NewMember({
      first_name,
      last_name,
      birth_date,
      mobile_number,
      emergency_number,
      number_of_member,
      name_of_each_member,
      block,
      floor_number,
      flat_number,
      email,
      two_wheeler,
      four_wheeler,
      status,
      role,
      society: req.user._id // Associate with logged-in admin's society
    });

    // Register with passport-local-mongoose (handles password hashing)
    await NewMember.register(newResident, create_password);

    // Fetch the created document to get the ID
    const createdResident = await NewMember.findOne({ email });

    res.status(201).json({
      ok: true,
      message: 'Resident added successfully',
      id: createdResident._id
    });

  } catch (error) {
    console.error('Error adding new resident:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    if (error.name === 'UserExistsError') {
      return res.status(409).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const adminLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed.' });
    }
    res.status(200).json({ message: 'Logged out successfully.' });
  });
};

const residentLogin = async (req, res, next) => {
  passport.authenticate('resident-local', (err, user, info) => {
    if (err) {
      console.error('Resident login error:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Invalid credentials.' });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Resident login session error:', err);
        return res.status(500).json({ error: 'Login failed.' });
      }

      res.status(200).json({
        message: 'Login successful.',
        redirect: '/resident/dashboard',
        user: {
          id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    });
  })(req, res, next);
};

module.exports = {
  createSocietyAccount,
  getAllSocieties,
  getSocietyById,
  updateSociety,
  deleteSociety,
  adminLogin,
  adminLogout,
  addNewResident,
  residentLogin,
};
