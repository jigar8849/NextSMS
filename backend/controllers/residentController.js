const Complaints = require('../models/complain');
const Event = require('../models/event');
const NewMember = require('../models/newMember');
const SocitySetUp = require('../models/socitySetUp');
const Employee = require('../models/employee');

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
      resident: req.body.resident || null, // Use provided resident ID or null for now
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

module.exports = {
  addComplaint,
  addEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getParking,
  getEmployees,
};
