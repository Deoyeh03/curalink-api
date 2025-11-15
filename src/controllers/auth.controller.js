import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';

const signToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });

const signRefresh = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ 
        success: false,
        error: { message: 'All fields required', code: 'VALIDATION_ERROR' }
      });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ 
      success: false,
      error: { message: 'User already exists', code: 'USER_EXISTS' }
    });

    const user = await User.create({
      name,
      email,
      password,
      role: role?.toLowerCase() || 'patient', // ← Lowercase
    });

    const accessToken = signToken(user);
    const refreshToken = signRefresh(user);

    // Format user object to match frontend expectations
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileCompleted: user.onboarded || false,
      conditions: user.conditions || [],
      keywords: user.keywords || [],
      specialties: user.specialties || [],
      researchInterests: user.researchInterests || [],
      location: user.location || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({
      success: true,
      data: { 
        user: userResponse, 
        accessToken,      // ← Changed from 'token'
        refreshToken      // ← Changed from 'refresh'
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: { message: err.message, code: 'SIGNUP_ERROR' }
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ 
        success: false,
        error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }
      });

    const accessToken = signToken(user);
    const refreshToken = signRefresh(user);

    // Format user object
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileCompleted: user.onboarded || false,
      conditions: user.conditions || [],
      keywords: user.keywords || [],
      specialties: user.specialties || [],
      researchInterests: user.researchInterests || [],
      location: user.location || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      data: { 
        user: userResponse, 
        accessToken, 
        refreshToken 
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: { message: err.message, code: 'LOGIN_ERROR' }
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ 
      success: false,
      error: { message: 'No refresh token', code: 'NO_TOKEN' }
    });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ 
      success: false,
      error: { message: 'User not found', code: 'USER_NOT_FOUND' }
    });

    const accessToken = signToken(user);
    res.json({ 
      success: true, 
      data: { accessToken }
    });
  } catch {
    res.status(401).json({ 
      success: false,
      error: { message: 'Invalid refresh token', code: 'INVALID_TOKEN' }
    });
  }
};

export const getProfile = async (req, res) => {
  const userResponse = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    profileCompleted: req.user.onboarded || false,
    conditions: req.user.conditions || [],
    keywords: req.user.keywords || [],
    specialties: req.user.specialties || [],
    researchInterests: req.user.researchInterests || [],
    location: req.user.location || null,
    bio: req.user.bio || '',
    institution: req.user.institution || '',
    availability: req.user.availability || 'available',
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt
  };

  res.json({ 
    success: true, 
    data: { user: userResponse }
  });
};