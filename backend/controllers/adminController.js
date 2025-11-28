const SocitySetUp = require('../models/socitySetUp');
const NewMember = require('../models/newMember');
const AdminBillTemplate = require('../models/adminBill');
const ResidentBill = require('../models/residentBill');
const Employee = require('../models/employee');
const Complaints = require('../models/complain');
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

    // Check if admin is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }

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

    // Get the logged-in admin's society ID
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }
    const societyId = req.user._id;

    // Create new bill template
    const newBill = new AdminBillTemplate({
      title: title.trim(),
      type,
      amount: parsedAmount,
      penalty: parsedPenalty,
      dueDate: new Date(dueDate),
      createdBy: societyId
    });

    await newBill.save();

    // Fetch all residents for this society
    const residents = await NewMember.find({ society: societyId });

    // Create ResidentBill documents for each resident
    const residentBills = residents.map(resident => ({
      resident: resident._id,
      billTemplate: newBill._id,
      amount: parsedAmount,
      dueDate: new Date(dueDate),
      penaltyPerDay: parsedPenalty,
      isPaid: false
    }));

    // Insert all resident bills at once
    if (residentBills.length > 0) {
      await ResidentBill.insertMany(residentBills);
    }

    res.status(201).json({
      ok: true,
      message: `Bill created successfully for ${residents.length} residents`,
      bill: newBill,
      residentsCount: residents.length
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

// Get all complaints for the logged-in admin's society
const getComplaints = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }
    const societyId = req.user._id; // Assuming req.user is the logged-in admin
    console.log('Fetching complaints for society:', societyId);

    // Fetch complaints for the society, populate resident details
    const complaints = await Complaints.find({ resident: { $in: await NewMember.find({ society: societyId }).select('_id') } })
      .populate('resident', 'first_name last_name block flat_number mobile_number')
      .sort({ created_at: -1 }); // Sort by creation date descending

    console.log('Found complaints:', complaints.length);

    // Map to the format expected by frontend
    const formattedComplaints = complaints.map(complaint => ({
      id: complaint._id.toString(),
      title: complaint.title,
      description: complaint.description,
      resident: complaint.resident ? `${complaint.resident.first_name} ${complaint.resident.last_name}` : 'Unknown',
      flat: complaint.resident ? `${complaint.resident.block}-${complaint.resident.flat_number}` : 'Unknown',
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status === 'InProgress' ? 'In-Progress' : (complaint.status === 'Complete' || complaint.status === 'Reject') ? 'Resolved' : complaint.status,
      date: complaint.created_at.toISOString().split('T')[0], // Format as YYYY-MM-DD
      attachments: complaint.Attachments ? 1 : 0, // Simple count, adjust if multiple attachments
    }));

    // Calculate stats
    const total = formattedComplaints.length;
    const pending = formattedComplaints.filter(c => c.status === 'Pending').length;
    const inProgress = formattedComplaints.filter(c => c.status === 'InProgress').length;
    const resolved = formattedComplaints.filter(c => c.status === 'Complete' || c.status === 'Reject').length;

    const stats = {
      total,
      pending,
      inProgress,
      resolved
    };

    res.status(200).json({
      complaints: formattedComplaints,
      stats
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid complaint ID' });
    }

    // Validate status
    const validStatuses = ['Pending', 'InProgress', 'Complete', 'On-hold', 'Reject'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Find the complaint and check if it belongs to the admin's society
    const complaint = await Complaints.findById(id).populate('resident', 'society');
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Check if the complaint's resident belongs to the admin's society
    if (!complaint.resident || complaint.resident.society.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this complaint' });
    }

    // Update the status
    complaint.status = status;
    await complaint.save();

    res.status(200).json({
      message: 'Complaint status updated successfully',
      complaint: {
        id: complaint._id,
        status: complaint.status
      }
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all payments for the logged-in admin's society
const getPayments = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }
    const societyId = req.user._id; // Assuming req.user is the logged-in admin
    console.log('Fetching payments for society:', societyId);

    // Fetch all bill templates for the society
    const billTemplates = await AdminBillTemplate.find({ createdBy: societyId })
      .sort({ createdAt: -1 });

    // Fetch all residents for the society
    const residents = await NewMember.find({ society: societyId });

    console.log('Found bill templates:', billTemplates.length);
    console.log('Found residents:', residents.length);

    const payments = [];

    // For each bill template and each resident, create a payment entry
    for (const billTemplate of billTemplates) {
      for (const resident of residents) {
        // Check if a ResidentBill exists for this resident and bill template
        const existingBill = await ResidentBill.findOne({
          resident: resident._id,
          billTemplate: billTemplate._id
        });

        // Use existing bill data if available, otherwise use template data
        const billData = existingBill || {
          amount: billTemplate.amount,
          dueDate: billTemplate.dueDate,
          isPaid: false,
          paidAt: null
        };

        // Calculate overdue status
        const today = new Date();
        const dueDate = new Date(billData.dueDate);
        const isOverdue = !billData.isPaid && today > dueDate;
        const daysOverdue = isOverdue ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)) : 0;

        // Calculate current amount (base + penalty if overdue)
        const baseAmount = billData.amount;
        const penaltyAmount = isOverdue ? (billTemplate.penalty || 0) * daysOverdue : 0;
        const currentAmount = baseAmount + penaltyAmount;

        // Determine payment status
        let paymentStatus = 'Pending';
        if (billData.isPaid) {
          paymentStatus = 'Paid';
        } else if (isOverdue) {
          paymentStatus = 'Overdue';
        }

        // Format dates
        const formattedDueDate = dueDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });

        const paidAtFormatted = billData.paidAt ? billData.paidAt.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : null;

        payments.push({
          id: existingBill ? existingBill._id.toString() : `${billTemplate._id}-${resident._id}`,
          residentName: `${resident.first_name} ${resident.last_name}`,
          flat: `${resident.block}-${resident.flat_number}`,
          billTitle: billTemplate.title,
          billType: billTemplate.type,
          baseAmount: baseAmount,
          penaltyAmount: penaltyAmount,
          currentAmount: currentAmount,
          dueDate: formattedDueDate,
          isOverdue: isOverdue,
          daysOverdue: daysOverdue,
          isPaid: billData.isPaid,
          paidAt: paidAtFormatted,
          paymentStatus: paymentStatus,
          residentId: resident._id.toString(),
          billTemplateId: billTemplate._id.toString()
        });
      }
    }

    console.log('Total payments generated:', payments.length);
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark payment as paid
const markPaymentAsPaid = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as admin.' });
    }

    const { id } = req.params;
    let residentBill;

    if (mongoose.Types.ObjectId.isValid(id)) {
      // Existing ResidentBill
      residentBill = await ResidentBill.findById(id).populate('resident', 'society');
      if (!residentBill) {
        return res.status(404).json({ error: 'Payment not found' });
      }
    } else {
      // Composite ID: billTemplateId-residentId
      const [billTemplateId, residentId] = id.split('-');
      if (!mongoose.Types.ObjectId.isValid(billTemplateId) || !mongoose.Types.ObjectId.isValid(residentId)) {
        return res.status(400).json({ error: 'Invalid payment ID' });
      }

      // Check if ResidentBill exists
      residentBill = await ResidentBill.findOne({
        resident: residentId,
        billTemplate: billTemplateId
      }).populate('resident', 'society');

      if (!residentBill) {
        // Fetch bill template and resident to create ResidentBill
        const billTemplate = await AdminBillTemplate.findById(billTemplateId);
        const resident = await NewMember.findById(residentId);

        if (!billTemplate || !resident) {
          return res.status(404).json({ error: 'Bill template or resident not found' });
        }

        // Create ResidentBill
        residentBill = new ResidentBill({
          resident: resident._id,
          billTemplate: billTemplate._id,
          amount: billTemplate.amount,
          dueDate: billTemplate.dueDate,
          penaltyPerDay: billTemplate.penalty,
          isPaid: false
        });

        await residentBill.save();
        // Re-populate after save
        residentBill = await ResidentBill.findById(residentBill._id).populate('resident', 'society');
      }
    }

    // Check if the resident belongs to the admin's society
    if (!residentBill.resident || residentBill.resident.society.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this payment' });
    }

    // Mark as paid
    residentBill.isPaid = true;
    residentBill.paidAt = new Date();
    residentBill.totalPaid = residentBill.amount; // Assuming totalPaid is the amount paid
    await residentBill.save();

    res.status(200).json({
      message: 'Payment marked as paid successfully',
      payment: {
        id: residentBill._id,
        isPaid: residentBill.isPaid,
        paidAt: residentBill.paidAt
      }
    });
  } catch (error) {
    console.error('Error updating payment:', error);
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
  getComplaints,
  updateComplaintStatus,
  getPayments,
  markPaymentAsPaid,
};
