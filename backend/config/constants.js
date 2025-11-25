/**
 * Application Constants
 * Centralized location for all magic strings and enums
 */

// User Roles
const ROLES = {
  ADMIN: 'admin',
  RESIDENT: 'resident'
};

// User Model Names (for passport serialization)
const MODEL_NAMES = {
  SOCIETY: 'SocitySetUp',
  RESIDENT: 'NewMember'
};

// Complaint Status
const COMPLAINT_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'InProgress',
  COMPLETE: 'Complete',
  ON_HOLD: 'On-hold',
  REJECT: 'Reject'
};

// Complaint Categories
const COMPLAINT_CATEGORIES = [
  'Maintenance',
  'Security',
  'Noise',
  'Parking',
  'Cleaning',
  'Other'
];

// Complaint Priorities
const COMPLAINT_PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Urgent'
];

// Employee Roles
const EMPLOYEE_ROLES = [
  'Security Guard',
  'Housekeeping',
  'Electrician',
  'Plumber',
  'Gardener',
  'Manager',
  'Other'
];

// Employee Status
const EMPLOYEE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

// Venue Mappings for Events
const VENUES = {
  v1: 'Club House',
  v2: 'Garden Area',
  v3: 'Community Hall',
  v4: 'Terrace Garden'
};

// Event Status
const EVENT_STATUS = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

// Resident Status
const RESIDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'in-active'
};

// Bill Types
const BILL_TYPES = [
  'Maintenance',
  'Electricity',
  'Water',
  'Other'
];

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  OVERDUE: 'Overdue'
};

// Passport Strategies
const PASSPORT_STRATEGIES = {
  SOCIETY: 'society-local',
  RESIDENT: 'resident-local'
};

module.exports = {
  ROLES,
  MODEL_NAMES,
  COMPLAINT_STATUS,
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  EMPLOYEE_ROLES,
  EMPLOYEE_STATUS,
  VENUES,
  EVENT_STATUS,
  RESIDENT_STATUS,
  BILL_TYPES,
  PAYMENT_STATUS,
  PASSPORT_STRATEGIES
};
