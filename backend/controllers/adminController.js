const SocitySetUp = require('../models/socitySetUp');
const NewMember = require('../models/newMember');
const AdminBillTemplate = require('../models/adminBill');
const Employee = require('../models/employee');
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

// Create bill template
const createBill = async (req, res) => {
  try {
    const { title, type, amount, penalty, dueDate } = req.body;

    // Validation
    if (!title || !type || !amount || !dueDate) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const parsedAmount = parseFloat(amount);
    const parsedPenalty = penalty ? parseFloat(penalty) : 0;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (isNaN(parsedPenalty) || parsedPenalty < 0) {
      return res.status(400).json({ error: 'Invalid penalty' });
    }

    // Create new bill template
    const newBill = new AdminBillTemplate({
      title: title.trim(),
      type,
      amount: parsedAmount,
      penalty: parsedPenalty,
      dueDate: new Date(dueDate),
      createdBy: req.user ? req.user._id : null // Admin's society ID, optional for now
    });

    await newBill.save();

    res.status(201).json({
      ok: true,
      message: 'Bill created successfully',
      bill: newBill
    });

  } catch (error) {
    console.error('Error creating bill:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
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

// Add new employee
const addNewEmployee = async (req, res) => {
  try {
    const {
      name,
      role,
      contact,
      salary,
      join_date,
      location,
      status
    } = req.body;

    // Validation
    if (!name || !role || !contact || !salary || !join_date || !location || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const parsedContact = Number(contact);
    const parsedSalary = Number(salary);

    if (isNaN(parsedContact) || parsedContact <= 0) {
      return res.status(400).json({ error: 'Invalid contact number' });
    }

    if (isNaN(parsedSalary) || parsedSalary <= 0) {
      return res.status(400).json({ error: 'Invalid salary amount' });
    }

    // Create new employee
    const newEmployee = new Employee({
      name: name.trim(),
      role,
      contact: parsedContact,
      salary: parsedSalary,
      join_date: new Date(join_date),
      location: location.trim(),
      status,
      society: req.body.society || req.user?._id // Use provided society or logged-in admin's society
    });

    await newEmployee.save();

    res.status(201).json({
      ok: true,
      message: 'Employee added successfully',
      employee: newEmployee
    });

  } catch (error) {
    console.error('Error adding new employee:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all employees for the logged-in admin's society
const getEmployees = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }
    const societyId = req.user._id; // Assuming req.user is the logged-in admin
    console.log('Fetching employees for society:', societyId);

    // Fetch employees for the society
    const employees = await Employee.find({ society: societyId });
    console.log('Found employees:', employees.length);

    // Calculate stats
    const totalEmployees = employees.length;
    const totalActiveEmployees = employees.filter(emp => emp.status === 'Active').length;
    const totalInactiveEmployees = totalEmployees - totalActiveEmployees;
    const totalSalaryAmount = employees.reduce((sum, emp) => sum + emp.salary, 0);

    const stats = {
      totalEmployees,
      totalActiveEmployees,
      totalInactiveEmployees,
      totalSalaryAmount
    };

    res.status(200).json({
      employees,
      stats
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all residents for the logged-in admin's society
const getResidents = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }
    const societyId = req.user._id; // Assuming req.user is the logged-in admin
    console.log('Fetching residents for society:', societyId);

    // Fetch residents for the society
    const residents = await NewMember.find({ society: societyId });
    console.log('Found residents:', residents.length);

    res.status(200).json(residents);
  } catch (error) {
    console.error('Error fetching residents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a resident by ID
const deleteResident = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid resident ID' });
    }

    // Check if resident belongs to the logged-in admin's society
    const resident = await NewMember.findOne({ _id: id, society: req.user._id });
    if (!resident) {
      return res.status(404).json({ error: 'Resident not found or not authorized' });
    }

    // Delete the resident
    await NewMember.findByIdAndDelete(id);

    res.status(200).json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Error deleting resident:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get parking data for the logged-in admin's society
const getParking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }
    const societyId = req.user._id; // Assuming req.user is the logged-in admin

    // Fetch society details for slot totals
    const society = await SocitySetUp.findById(societyId);
    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    // Fetch residents with vehicles
    const residents = await NewMember.find({
      society: societyId,
      $or: [
        { two_wheeler: { $exists: true, $ne: '' } },
        { four_wheeler: { $exists: true, $ne: '' } }
      ]
    });

    // Map residents to the required format
    const residentsWithVehicles = residents.map(resident => ({
      id: resident._id.toString(),
      name: `${resident.first_name} ${resident.last_name}`,
      phone: resident.mobile_number.toString(),
      block: resident.block,
      flat: resident.flat_number,
      vehicles: [
        ...(resident.two_wheeler ? [{ reg: resident.two_wheeler, type: '2-wheeler' }] : []),
        ...(resident.four_wheeler ? [{ reg: resident.four_wheeler, type: '4-wheeler' }] : [])
      ]
    }));

    // Calculate occupied slots
    const occupied2 = residentsWithVehicles.reduce(
      (n, r) => n + r.vehicles.filter((v) => v.type === '2-wheeler').length,
      0
    );
    const occupied4 = residentsWithVehicles.reduce(
      (n, r) => n + r.vehicles.filter((v) => v.type === '4-wheeler').length,
      0
    );

    const parkingData = {
      totalTwoWheelerSlots: society.total_two_wheeler_slot,
      totalFourWheelerSlots: society.total_four_wheeler_slot,
      occupiedTwoWheeler: occupied2,
      occupiedFourWheeler: occupied4,
      residents: residentsWithVehicles
    };

    res.status(200).json(parkingData);
  } catch (error) {
    console.error('Error fetching parking data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
  createBill,
  residentLogin,
  addNewEmployee,
  getEmployees,
  getResidents,
  deleteResident,
  getParking,
};
