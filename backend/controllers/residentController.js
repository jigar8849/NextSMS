const Complaints = require('../models/complain');
const Event = require('../models/event');
const NewMember = require('../models/newMember');
const SocitySetUp = require('../models/socitySetUp');
const Employee = require('../models/employee');
const ResidentBill = require('../models/residentBill');
const Razorpay = require("razorpay");
const crypto = require('crypto');

// Add new complaint
const addComplaint = async (req, res) => {
  try {
    const {
      title,
      category,
      priority,
      description,
      date,
      Attachments // optional
    } = req.body;

    // Validation
    if (!title || !category || !priority || !description) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Create new complaint
    const newComplaint = new Complaints({
      title: title.trim(),
      category,
      priority,
      description: description.trim(),
      resident: req.user ? req.user._id : null, // Use logged-in resident ID
      Attachments: Attachments || {} // Optional attachments
    });

    await newComplaint.save();

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: newComplaint
    });

  } catch (error) {
    console.error('Error adding complaint:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get complaints for the logged-in resident
const getComplaints = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    // Fetch complaints for the logged-in resident
    const complaints = await Complaints.find({ resident: req.user._id }).sort({ created_at: -1 });

    // Map to frontend expected format
    const mappedComplaints = complaints.map(complaint => ({
      id: complaint._id.toString(),
      title: complaint.title,
      description: complaint.description,
      filedOn: complaint.created_at.toISOString(),
      category: complaint.category,
      status: mapStatus(complaint.status),
      priority: complaint.priority,
      attachments: complaint.Attachments && complaint.Attachments.url ? 1 : 0 // Assuming single attachment
    }));

    res.status(200).json({
      success: true,
      complaints: mappedComplaints
    });

  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to map backend status to frontend status
function mapStatus(backendStatus) {
  switch (backendStatus) {
    case 'Pending':
      return 'Pending';
    case 'InProgress':
      return 'In Progress';
    case 'Complete':
      return 'Resolved';
    case 'Reject':
      return 'Rejected';
    case 'On-hold':
      return 'In Progress'; // Assuming On-hold as In Progress
    default:
      return 'Pending';
  }
}

// Add new event
const addEvent = async (req, res) => {
  try {
    const {
      title,
      venueId,
      attendees,
      date,
      startTime,
      endTime
    } = req.body;

    // Validation
    if (!title || !venueId || !attendees || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Map venueId to venue name
    const VENUES = {
      v1: "Club House",
      v2: "Garden Area",
      v3: "Community Hall",
      v4: "Terrace Garden"
    };
    const venue = VENUES[venueId];
    if (!venue) {
      return res.status(400).json({ error: 'Invalid venue selected' });
    }

    // Create new event
    const newEvent = new Event({
      title: title.trim(),
      venue,
      date: new Date(date),
      startTime,
      endTime,
      attendees: Number(attendees),
      createdBy: req.user ? req.user._id : null // Set createdBy to logged-in resident or null
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event booked successfully',
      event: newEvent
    });

  } catch (error) {
    console.error('Error adding event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get parking data for the logged-in resident's society
const getParking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }
    const societyId = req.user.society; // Resident's society ID

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

// Get all employees for the logged-in resident's society
const getEmployees = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }
    const societyId = req.user.society; // Resident's society ID
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

// Get events (no auth required for viewing)
const getEvents = async (req, res) => {
  try {
    // Fetch all events, populate createdBy for organizer name
    const events = await Event.find()
      .populate('createdBy', 'first_name last_name')
      .sort({ date: 1 }); // Sort by date ascending

    // Map to frontend expected format
    const formattedEvents = events.map(event => ({
      id: event._id.toString(),
      title: event.title,
      date: event.date.toISOString().split('T')[0], // YYYY-MM-DD
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue, // Direct venue string
      attendees: event.attendees,
      organizer: event.createdBy ? `${event.createdBy.first_name} ${event.createdBy.last_name}` : 'Unknown',
      status: event.status
    }));

    res.status(200).json({
      success: true,
      events: formattedEvents
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Find and update event, ensure user owns it
    const event = await Event.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const { id } = req.params;

    // Find and delete event, ensure user owns it
    const event = await Event.findOneAndDelete({ _id: id, createdBy: req.user._id });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get bills for the logged-in resident
const getBills = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    // Fetch bills for the logged-in resident, populate billTemplate
    const bills = await ResidentBill.find({ resident: req.user._id })
      .populate('billTemplate')
      .sort({ createdAt: -1 });

    // Map to frontend expected format
    const mappedBills = bills.map(bill => {
      const template = bill.billTemplate;
      let status = 'Unpaid';
      if (bill.isPaid) {
        status = 'Paid';
      } else {
        const now = new Date();
        if (new Date(bill.dueDate) < now) {
          status = 'Overdue';
        }
      }

      return {
        id: bill._id.toString(),
        title: template.title,
        description: template.type, // Use type as description
        dueDate: bill.dueDate.toISOString(),
        amount: bill.amount,
        status: status,
      };
    });

    res.status(200).json({
      success: true,
      bills: mappedBills
    });

  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create Razorpay order for payment
const createPaymentOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const { billIds } = req.body; // Array of bill IDs to pay

    if (!billIds || !Array.isArray(billIds) || billIds.length === 0) {
      return res.status(400).json({ error: 'Bill IDs are required' });
    }

    // Fetch bills for the logged-in resident
    const bills = await ResidentBill.find({
      _id: { $in: billIds },
      resident: req.user._id,
      isPaid: false
    }).populate('billTemplate');

    if (bills.length === 0) {
      return res.status(404).json({ error: 'No unpaid bills found' });
    }

    // Calculate total amount
    const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create order
    const options = {
      amount: totalAmount * 100, // Amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify Razorpay payment and update bills
const verifyPayment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, billIds } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !billIds || !Array.isArray(billIds)) {
      return res.status(400).json({ error: 'Payment details and bill IDs are required' });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Update bills to paid
    await ResidentBill.updateMany(
      { _id: { $in: billIds }, resident: req.user._id, isPaid: false },
      { isPaid: true, paidAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified and bills updated successfully'
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Get profile data for logged-in resident
const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const resident = await NewMember.findById(req.user._id)
      .select('-hash -salt') // Exclude password fields
      .populate('society', 'name address');

    if (!resident) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    // Format profile data
    const profileData = {
      profile: {
        id: resident._id,
        firstName: resident.first_name,
        lastName: resident.last_name,
        email: resident.email,
        phone: resident.mobile_number.toString(),
        emergency: resident.emergency_number.toString(),
        dob: resident.birth_date.toISOString().split('T')[0],
        flat: `Block ${resident.block} - Floor ${resident.floor_number} - Flat ${resident.flat_number}`,
        role: resident.role === 'admin' ? 'Admin' : 'Resident',
        since: resident.createdAt.toISOString().split('T')[0],
        block: resident.block,
        floorNumber: resident.floor_number,
        flatNumber: resident.flat_number
      },
      family: resident.name_of_each_member || [],
      vehicles: []
    };

    // Add vehicles if they exist
    if (resident.two_wheeler) {
      profileData.vehicles.push({
        id: 'two_wheeler',
        regNo: resident.two_wheeler,
        type: '2-wheeler'
      });
    }

    if (resident.four_wheeler) {
      profileData.vehicles.push({
        id: 'four_wheeler',
        regNo: resident.four_wheeler,
        type: '4-wheeler'
      });
    }

    // Add stats
    profileData.stats = {
      totalFamilyMembers: resident.name_of_each_member?.length || 0,
      totalVehicles: profileData.vehicles.length,
      memberSince: resident.createdAt.toISOString().split('T')[0]
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const {
      firstName,
      lastName,
      phone,
      emergency,
      dob,
      familyMembers
    } = req.body;

    const updateData = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: parseInt(phone),
      emergency_number: parseInt(emergency),
      birth_date: new Date(dob),
      name_of_each_member: familyMembers
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedResident = await NewMember.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-hash -salt');

    res.status(200).json({ 
      success: true,
      message: 'Profile updated successfully',
      profile: updatedResident 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add family member
const addFamilyMember = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Family member name is required' });
    }

    const resident = await NewMember.findById(req.user._id);
    
    // Add new family member to the array
    const updatedFamily = [...(resident.name_of_each_member || []), name.trim()];
    
    const updatedResident = await NewMember.findByIdAndUpdate(
      req.user._id,
      { 
        name_of_each_member: updatedFamily,
        number_of_member: updatedFamily.length 
      },
      { new: true }
    ).select('-hash -salt');

    res.status(200).json({ 
      success: true,
      message: 'Family member added successfully',
      family: updatedResident.name_of_each_member 
    });
  } catch (error) {
    console.error('Error adding family member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add vehicle
const addVehicle = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const { regNo, type } = req.body;
    
    if (!regNo || !type) {
      return res.status(400).json({ error: 'Registration number and type are required' });
    }

    const updateField = type === '2-wheeler' ? 'two_wheeler' : 'four_wheeler';
    
    const resident = await NewMember.findById(req.user._id);
    
    // Check if vehicle already exists
    if (resident[updateField]) {
      return res.status(400).json({ error: `${type} already registered` });
    }

    const updatedResident = await NewMember.findByIdAndUpdate(
      req.user._id,
      { [updateField]: regNo },
      { new: true }
    ).select('-hash -salt');

    res.status(200).json({ 
      success: true,
      message: 'Vehicle added successfully',
      vehicle: {
        id: updateField,
        regNo: regNo,
        type: type
      }
    });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const { id } = req.params;
    const { regNo } = req.body;

    if (!regNo) {
      return res.status(400).json({ error: 'Registration number is required' });
    }

    // Determine which vehicle field to update
    const updateField = id === 'two_wheeler' ? 'two_wheeler' : 
                       id === 'four_wheeler' ? 'four_wheeler' : null;

    if (!updateField) {
      return res.status(400).json({ error: 'Invalid vehicle ID' });
    }

    const updatedResident = await NewMember.findByIdAndUpdate(
      req.user._id,
      { [updateField]: regNo },
      { new: true }
    ).select('-hash -salt');

    res.status(200).json({ 
      success: true,
      message: 'Vehicle updated successfully',
      vehicle: {
        id: updateField,
        regNo: regNo,
        type: updateField === 'two_wheeler' ? '2-wheeler' : '4-wheeler'
      }
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete family member
const deleteFamilyMember = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in as resident.' });
    }

    const { index } = req.params;
    const memberIndex = parseInt(index);

    const resident = await NewMember.findById(req.user._id);
    
    if (!resident.name_of_each_member || memberIndex >= resident.name_of_each_member.length) {
      return res.status(400).json({ error: 'Invalid family member index' });
    }

    // Remove the family member at specified index
    const updatedFamily = resident.name_of_each_member.filter((_, i) => i !== memberIndex);
    
    const updatedResident = await NewMember.findByIdAndUpdate(
      req.user._id,
      { 
        name_of_each_member: updatedFamily,
        number_of_member: updatedFamily.length 
      },
      { new: true }
    ).select('-hash -salt');

    res.status(200).json({ 
      success: true,
      message: 'Family member removed successfully',
      family: updatedResident.name_of_each_member 
    });
  } catch (error) {
    console.error('Error deleting family member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Change password for logged-in resident
const changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Find resident
    const resident = await NewMember.findById(req.user._id);
    if (!resident) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await resident.authenticate(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if new password is same as current
    const isSamePassword = await resident.authenticate(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password cannot be the same as current password' });
    }

    // Change password using passport-local-mongoose method
    await resident.setPassword(newPassword);
    await resident.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
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
  changePassword,

};
