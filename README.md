# NextSMS - Society Management System

NextSMS is a comprehensive society management system designed to streamline residential community operations. It provides a modern, user-friendly platform for managing residents, payments, complaints, events, and more, all in one place.

## Features

- **Resident Management**: Complete resident profiles with family details, vehicle information, and automated onboarding
- **Smart Payments**: Automated billing, payment tracking, digital receipts, and integrated payment gateways with reminders
- **Event Management**: Community hall booking, event scheduling, automated notifications, and capacity management
- **Smart Complaints**: AI-powered complaint categorization, photo/video evidence, real-time tracking, and automated escalation
- **Parking Management**: Track vehicle registrations and parking slot availability
- **Employee Management**: Manage staff, salaries, and roles within the society
- **Dashboard Analytics**: Real-time insights and statistics for both admins and residents

## Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** for database
- **Passport.js** for authentication (local strategy)
- **Razorpay** for payment processing
- **bcryptjs** for password hashing
- Security middleware: Helmet, CORS, Rate Limiting, Compression

### Frontend
- **Next.js 15** with **React 19**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/nextsms
   SESSION_SECRET=your_session_secret_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`

## Project Workflow

### General System Flow
1. **Society Setup**: Admin creates a society account with basic details (name, address, structure)
2. **Resident Onboarding**: Admin adds residents with their details, family members, and vehicles
3. **Employee Management**: Admin adds and manages staff members
4. **Billing System**: Admin creates bill templates that automatically generate bills for all residents
5. **Payment Processing**: Residents can view and pay bills through integrated Razorpay gateway
6. **Complaint Management**: Residents submit complaints, admins track and resolve them
7. **Event Booking**: Residents can book community venues for events
8. **Parking Management**: System tracks vehicle registrations and parking availability

### Authentication Flow
- Separate login portals for admins and residents
- Session-based authentication with secure cookies
- Role-based access control throughout the application

## Admin Role Details

### Admin Capabilities
- **Society Management**: Create and manage society accounts
- **Resident Management**:
  - Add new residents with complete profile information
  - View all residents in the society
  - Edit resident details
  - Delete resident accounts
- **Employee Management**:
  - Add new employees (security, maintenance, etc.)
  - View employee details and statistics
  - Manage employee salaries and status
- **Billing & Payments**:
  - Create bill templates (maintenance, utilities, etc.)
  - Automatically generate bills for all residents
  - Track payment status and overdue amounts
  - Mark payments as paid (cash/offline)
  - View payment history and analytics
- **Complaint Management**:
  - View all complaints from residents
  - Update complaint status (Pending, In Progress, Resolved, Rejected)
  - Track complaint categories and priorities
- **Parking Management**:
  - View parking slot availability
  - Track vehicle registrations per resident
  - Monitor parking utilization
- **Dashboard Analytics**:
  - Total residents count
  - Pending payments amount
  - Active complaints count
  - Parking slot utilization

### Admin Workflow
1. **Login** to admin portal
2. **Dashboard Overview**: Check key metrics and recent activities
3. **Manage Residents**: Add new residents, update information
4. **Handle Billing**: Create bills, monitor payments, send reminders
5. **Process Complaints**: Review, assign, and resolve resident issues
6. **Oversee Operations**: Manage employees, parking, events
7. **Generate Reports**: View analytics and financial summaries

## Resident Role Details

### Resident Capabilities
- **Profile Management**:
  - View and update personal information
  - Manage family member details
  - Add/update vehicle registrations
  - Change password
- **Billing & Payments**:
  - View all bills and payment history
  - Pay bills online via Razorpay integration
  - Track payment status and due dates
- **Complaint Submission**:
  - Submit complaints with categories and priorities
  - Upload attachments (photos/videos)
  - Track complaint status and updates
- **Event Management**:
  - View available community venues
  - Book events with availability checking
  - Manage personal event bookings
  - Edit or cancel upcoming events
- **Parking Information**:
  - View parking slot availability
  - Check registered vehicles
- **Staff Directory**:
  - View employee contact information
  - Access emergency contacts
- **Dashboard Overview**:
  - Pending bills count
  - Open complaints status
  - Upcoming events
  - Vehicle registration summary

### Resident Workflow
1. **Login** to resident portal
2. **Dashboard Overview**: Check personal metrics and notifications
3. **Manage Profile**: Update personal and family information
4. **Handle Bills**: Review bills, make online payments
5. **Submit Complaints**: Report issues with detailed descriptions
6. **Book Events**: Schedule community events and gatherings
7. **Access Services**: View staff contacts, parking info

## API Endpoints Overview

### Admin Routes (`/admin`)
- `POST /admin/login` - Admin login
- `POST /admin/logout` - Admin logout
- `POST /admin/create-society` - Create society account
- `POST /admin/add-resident` - Add new resident
- `POST /admin/add-employee` - Add new employee
- `POST /admin/create-bill` - Create bill template
- `GET /admin/dashboard` - Get dashboard stats
- `GET /admin/residents` - Get all residents
- `DELETE /admin/residents/:id` - Delete resident
- `GET /admin/employees` - Get all employees
- `GET /admin/complaints` - Get all complaints
- `PUT /admin/complaints/:id/status` - Update complaint status
- `GET /admin/payments` - Get all payments
- `PUT /admin/payments/:id/pay` - Mark payment as paid
- `GET /admin/parking` - Get parking data

### Resident Routes (`/resident`)
- `POST /resident/login` - Resident login
- `POST /resident/add-complaint` - Submit complaint
- `GET /resident/complaints` - Get user complaints
- `POST /resident/book-event` - Book event
- `GET /resident/events` - Get all events
- `PUT /resident/events/:id` - Update event
- `DELETE /resident/events/:id` - Delete event
- `GET /resident/bills` - Get user bills
- `POST /resident/payment/order` - Create payment order
- `POST /resident/payment/verify` - Verify payment
- `GET /resident/profile` - Get profile data
- `PUT /resident/profile` - Update profile
- `POST /resident/profile/family` - Add family member
- `POST /resident/profile/vehicle` - Add vehicle
- `PUT /resident/profile/vehicle/:id` - Update vehicle
- `DELETE /resident/profile/family/:index` - Delete family member
- `GET /resident/dashboard` - Get dashboard stats
- `PUT /resident/change-password` - Change password
- `GET /resident/parking` - Get parking data
- `GET /resident/employees` - Get employee list

## Security Features

- **Authentication**: Secure login with password hashing
- **Authorization**: Role-based access control
- **Session Management**: Secure session handling with HTTP-only cookies
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive validation on all inputs
- **Password Security**: Minimum length requirements and secure hashing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

**NextSMS** - Making society management simple and efficient.














<!-- 
// Load environment variables first
require('dotenv').config();

// Validate environment and load config
const config = require('./config/env');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Import middleware
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { PASSPORT_STRATEGIES, MODEL_NAMES } = require('./config/constants');

// Import routes
const adminRoutes = require('./routes/admin');
const residentRoutes = require('./routes/resident');

const app = express();

// REQUIRED for Render reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.isProduction
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration — must match deployed frontend URL
app.use(cors({
  origin: [
    "https://next-sms-frontend-6mwm.vercel.app",
    "https://next-sms-ten.vercel.app"
  ],
  credentials: true
}));


// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging middleware
app.use(requestLogger);

// Session configuration — required for cross-domain cookie
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  proxy: true, // <-- REQUIRED for Render HTTPS
  cookie: {
    secure: true, // force HTTPS cookies
    httpOnly: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  }
}));


// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
const SocitySetUp = require('./models/socitySetUp');
const NewMember = require('./models/newMember');
passport.use(PASSPORT_STRATEGIES.SOCIETY, new LocalStrategy({ usernameField: 'email' }, SocitySetUp.authenticate()));
passport.use(PASSPORT_STRATEGIES.RESIDENT, new LocalStrategy({ usernameField: 'email' }, NewMember.authenticate()));

passport.serializeUser((user, done) => {
  done(null, { id: user._id, type: user.constructor.modelName });
});
passport.deserializeUser(async (serializedUser, done) => {
  try {
    const { id, type } = serializedUser;
    let UserModel;
    if (type === MODEL_NAMES.SOCIETY) {
      UserModel = SocitySetUp;
    } else if (type === MODEL_NAMES.RESIDENT) {
      UserModel = NewMember;
    } else {
      return done(new Error('Unknown user type'));
    }
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
app.use('/admin', adminRoutes);
app.use('/resident', residentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Server is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✓ Connected to MongoDB');
  console.log(`✓ Environment: ${config.nodeEnv}`);
  app.listen(config.port, () => {
    console.log(`✓ Server running on port ${config.port}`);
    console.log(`✓ Frontend URL: https://next-sms-frontend-6mwm.vercel.app`);
  });
})
.catch((err) => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});


module.exports = app; -->