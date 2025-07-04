import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/innovest')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  bio: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['investor', 'innovator', 'admin'] 
  },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'approved', 'rejected'] 
  },
  // Investor specific fields
  investmentFocus: { type: String },
  investmentRange: { type: String },
  // Innovator specific fields
  industry: { type: String },
  projectStage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Project schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  projectStage: { type: String, required: true },
  fundingNeeded: { type: Number, required: true },
  innovator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  interestedInvestors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASS || 'password'
  }
});

// Helper functions
const sendEmail = async (to, subject, html) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'Innovest <noreply@innovest.com>',
        to,
        subject,
        html
      });
    } else {
      console.log('Email would be sent in production:');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${html}`);
    }
  } catch (error) {
    console.error('Email error:', error);
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'innovest_secret_key',
    { expiresIn: '7d' }
  );
};

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'innovest_secret_key'
    );
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Role-based middleware
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

// Status middleware for non-admin users
const statusMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.status !== 'approved') {
    return res.status(403).json({ message: 'Your account is pending approval' });
  }
  next();
};

// Project routes
app.post('/api/projects', authMiddleware, roleMiddleware(['innovator']), statusMiddleware, async (req, res) => {
  try {
    const { title, description, industry, projectStage, fundingNeeded } = req.body;
    
    const project = new Project({
      title,
      description,
      industry,
      projectStage,
      fundingNeeded,
      innovator: req.user._id
    });
    
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ message: 'Server error during project creation' });
  }
});

app.get('/api/projects', authMiddleware, statusMiddleware, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('innovator', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

app.post('/api/projects/:projectId/like', authMiddleware, roleMiddleware(['investor']), statusMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const hasLiked = project.likes.includes(userId);
    
    if (hasLiked) {
      project.likes = project.likes.filter(id => !id.equals(userId));
    } else {
      project.likes.push(userId);
    }
    
    await project.save();
    
    res.json({ likes: project.likes.length, hasLiked: !hasLiked });
  } catch (error) {
    console.error('Project like error:', error);
    res.status(500).json({ message: 'Server error processing like' });
  }
});

app.post('/api/projects/:projectId/interest', authMiddleware, roleMiddleware(['investor']), statusMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;
    
    const project = await Project.findById(projectId)
      .populate('innovator', 'email firstName lastName');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const hasExpressedInterest = project.interestedInvestors.includes(userId);
    
    if (!hasExpressedInterest) {
      project.interestedInvestors.push(userId);
      await project.save();
      
      // Notify innovator
      const investor = await User.findById(userId);
      
      sendEmail(
        project.innovator.email,
        'New Investor Interest in Your Project',
        `
          <h2>New Interest in Your Project</h2>
          <p>Hello ${project.innovator.firstName},</p>
          <p>An investor has expressed interest in your project "${project.title}".</p>
          <p><strong>Investor Details:</strong></p>
          <ul>
            <li>Name: ${investor.firstName} ${investor.lastName}</li>
            <li>Email: ${investor.email}</li>
            <li>Investment Focus: ${investor.investmentFocus}</li>
            <li>Investment Range: ${investor.investmentRange}</li>
          </ul>
          <p>You can contact them directly to discuss potential collaboration.</p>
        `
      );
    }
    
    res.json({ 
      interestedInvestors: project.interestedInvestors.length,
      hasExpressedInterest: true
    });
  } catch (error) {
    console.error('Project interest error:', error);
    res.status(500).json({ message: 'Server error processing interest' });
  }
});

app.get('/api/innovator/projects', authMiddleware, roleMiddleware(['innovator']), statusMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ innovator: req.user._id })
      .populate('likes', 'firstName lastName')
      .populate('interestedInvestors', 'firstName lastName email investmentFocus investmentRange')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Innovator projects fetch error:', error);
    res.status(500).json({ message: 'Server error fetching innovator projects' });
  }
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, bio, role, ...additionalFields } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      bio,
      role,
      ...additionalFields
    });
    
    await user.save();
    
    // Notify admin of new registration
    sendEmail(
      'sujitasureshbabu@gmail.com',
      'New Innovest Registration',
      `
        <h2>New User Registration</h2>
        <p>A new user has registered on Innovest and is pending approval:</p>
        <ul>
          <li><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Role:</strong> ${role}</li>
        </ul>
        <p>Please review and approve or reject this registration.</p>
      `
    );
    
    // Notify user of pending approval
    sendEmail(
      email,
      'Innovest Registration Received',
      `
        <h2>Thank You for Registering with Innovest!</h2>
        <p>Hello ${firstName},</p>
        <p>Your registration has been received and is now pending admin approval. You'll receive another email once your account has been reviewed.</p>
        <p>Thank you for your patience.</p>
      `
    );
    
    res.status(201).json({ message: 'Registration successful! Awaiting admin approval.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if user is admin (for regular login)
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Please use admin login page' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data without password
    const userData = { ...user.toObject() };
    delete userData.password;
    
    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const user = await User.findOne({ email, role: 'admin' });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials or not an admin account' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data without password
    const userData = { ...user.toObject() };
    delete userData.password;
    
    res.json({ token, user: userData });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

// Admin routes
app.get('/api/admin/stats', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const pendingApprovals = await User.countDocuments({ status: 'pending' });
    const investors = await User.countDocuments({ role: 'investor' });
    const innovators = await User.countDocuments({ role: 'innovator' });
    
    const recentApprovals = await User.find({ 
      status: { $in: ['approved', 'rejected'] },
      role: { $ne: 'admin' }
    })
    .sort({ updatedAt: -1 })
    .limit(5);
    
    res.json({
      totalUsers,
      pendingApprovals,
      investors,
      innovators,
      recentApprovals
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching admin stats' });
  }
});

app.get('/api/admin/users/pending', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      status: 'pending',
      role: { $ne: 'admin' }
    }).sort({ createdAt: -1 });
    
    res.json(pendingUsers);
  } catch (error) {
    console.error('Pending users error:', error);
    res.status(500).json({ message: 'Server error fetching pending users' });
  }
});

app.get('/api/admin/users', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { role } = req.query;
    
    const query = { role: { $ne: 'admin' } };
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    const users = await User.find(query).sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

app.post('/api/admin/users/:userId/approve', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'approved', updatedAt: Date.now() },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Notify user of approval
    sendEmail(
      user.email,
      'Innovest Registration Approved',
      `
        <h2>Your Innovest Registration is Approved!</h2>
        <p>Hello ${user.firstName},</p>
        <p>Great news! Your Innovest account has been approved by our admin team.</p>
        <p>You can now log in and access all features on the platform.</p>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login">Click here to login</a></p>
      `
    );
    
    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error('User approval error:', error);
    res.status(500).json({ message: 'Server error during user approval' });
  }
});

app.post('/api/admin/users/:userId/reject', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status: 'rejected', updatedAt: Date.now() },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Notify user of rejection
    sendEmail(
      user.email,
      'Innovest Registration Update',
      `
        <h2>Innovest Registration Update</h2>
        <p>Hello ${user.firstName},</p>
        <p>We've reviewed your registration for Innovest, and unfortunately, we're unable to approve your account at this time.</p>
        <p>If you have any questions or would like to provide additional information, please contact our support team.</p>
      `
    );
    
    res.json({ message: 'User rejected successfully', user });
  } catch (error) {
    console.error('User rejection error:', error);
    res.status(500).json({ message: 'Server error during user rejection' });
  }
});

// Investor routes
app.get('/api/investor/dashboard', authMiddleware, roleMiddleware(['investor']), statusMiddleware, async (req, res) => {
  try {
    // This would normally fetch real data from the database
    // For demo purposes, we're returning mock data
    res.json({
      totalViewed: 12,
      saved: 5,
      contacted: 3,
      recommendations: [
        {
          title: 'EcoClean Water Filtration System',
          description: 'Revolutionary water filtration technology that removes 99.9% of contaminants without chemicals, designed for both industrial and consumer use.',
          industry: 'cleantech',
          projectStage: 'prototype',
          innovator: 'Sarah Chen'
        },
        {
          title: 'MedTrack Health Monitoring Platform',
          description: 'AI-powered health monitoring system that integrates with wearable devices to provide real-time health insights and early warning for medical conditions.',
          industry: 'health',
          projectStage: 'mvp',
          innovator: 'Michael Johnson'
        },
        {
          title: 'AgriTech Drone Crop Analysis',
          description: 'Automated drone system with advanced imaging technology to monitor crop health, optimize irrigation, and increase agricultural yields by up to 30%.',
          industry: 'tech',
          projectStage: 'market',
          innovator: 'David Rodriguez'
        }
      ]
    });
  } catch (error) {
    console.error('Investor dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching investor dashboard data' });
  }
});

// Innovator routes
app.get('/api/innovator/dashboard', authMiddleware, roleMiddleware(['innovator']), statusMiddleware, async (req, res) => {
  try {
    // This would normally fetch real data from the database
    // For demo purposes, we're returning mock data
    res.json({
      totalProjects: 2,
      totalViews: 45,
      savedByInvestors: 8,
      interestedInvestors: [
        {
          name: 'James Wilson',
          investmentFocus: 'Technology',
          investmentRange: 'Series A'
        },
        {
          name: 'Emily Zhang',
          investmentFocus: 'Healthcare',
          investmentRange: 'Angel'
        }
      ]
    });
  } catch (error) {
    console.error('Innovator dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching innovator dashboard data' });
  }
});

// Seed admin user on first run
const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'sujitasureshbabu@gmail.com',
        password: hashedPassword,
        phone: '555-123-4567',
        bio: 'System administrator',
        role: 'admin',
        status: 'approved'
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedAdminUser();
});