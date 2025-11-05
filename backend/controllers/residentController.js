const Complaints = require('../models/complain');
const Event = require('../models/event');

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
      createdBy: null // No auth for now
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

module.exports = {
  addComplaint,
  addEvent,
};
