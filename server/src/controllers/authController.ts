// server/src/controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

// Helper function to create JWT (keep this as is)
const createToken = (id: Types.ObjectId) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const lifetime = process.env.JWT_LIFETIME || '1d';

  const signOptions: SignOptions = {
    expiresIn: lifetime as any,
  };

  return jwt.sign({ id }, jwtSecret, signOptions);
};

// @desc    Register a new user (keep this as is)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    const user = await User.create({ username, email, password });

    const token = createToken(user._id as Types.ObjectId);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(400).json({ message: `A user with that ${field}: ${value} already exists.` });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token (keep this as is)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id as Types.ObjectId);

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// NEW: @desc    Get current user profile
// NEW: @route   GET /api/auth/profile
// NEW: @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  // `req.user` is populated by the `protect` middleware
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, user not found' });
  }

  // We are already sending the user object in the login response.
  // This route is useful if the frontend needs to re-fetch user data
  // without a full login, or if initial login response was slim.
  res.status(200).json({
    message: 'User profile fetched successfully',
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      // Add any other non-sensitive fields you want to expose, e.g., createdAt
      createdAt: req.user.createdAt,
    },
  });
};

// NEW: @desc    Update user profile
// NEW: @route   PUT /api/auth/profile
// NEW: @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, user not found' });
  }

  const { username, email } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for duplicate email if email is being changed
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      // Corrected: Add type assertions for _id
      if (emailExists && (emailExists._id as Types.ObjectId).toString() !== (user._id as Types.ObjectId).toString()) {
        return res.status(400).json({ message: 'Email already in use by another account' });
      }
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save({ validateBeforeSave: true }); // Ensure Mongoose validators run

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

// NEW: @desc    Update user password
// NEW: @route   PUT /api/auth/update-password
// NEW: @access  Private
export const updatePassword = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, user not found' });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide current and new passwords' });
  }

  try {
    // Select password to compare, as it's typically set to `select: false`
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    // Update password
    user.password = newPassword;
    await user.save({ validateBeforeSave: true }); // Mongoose pre-save hook for hashing will run

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during password update' });
  }
};