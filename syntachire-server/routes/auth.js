const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import User model
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, targetRole } = req.body;

  try {
    // 1. Basic Field Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // 2. Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and Save New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      targetRole: targetRole || "Full Stack Developer",
      loginStreak: {
        currentStreak: 1,
        longestStreak: 1,
        lastLoginDate: new Date(),
      },
    });

    await newUser.save();

    // 5. Create JWT Payload
    const payload = {
      user: {
        id: newUser._id,
      },
    };

    // 6. Sign JWT Token and Return Response
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            targetRole: newUser.targetRole,
            loginStreak: {
              currentStreak: 1,
              longestStreak: 1,
              lastLoginDate: newUser.loginStreak.lastLoginDate,
            },
          },
        });
      }
    );
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ message: 'Server Error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Basic Field Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all credentials.' });
    }

    // 2. Find User by Email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    // 3. Compare Passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Wrong password.' });
    }

    // 4. Update Login Streak
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // midnight today
    const lastLogin = existingUser.loginStreak?.lastLoginDate
      ? new Date(existingUser.loginStreak.lastLoginDate)
      : null;

    let currentStreak = existingUser.loginStreak?.currentStreak || 0;
    let longestStreak = existingUser.loginStreak?.longestStreak || 0;

    if (lastLogin) {
      const lastLoginDay = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
      const diffMs = todayStart.getTime() - lastLoginDay.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Logged in on the very next day — continue streak
        currentStreak += 1;
      } else if (diffDays === 0) {
        // Already logged in today — no change
        // currentStreak stays the same
      } else {
        // Missed one or more days — reset streak
        currentStreak = 1;
      }
    } else {
      // First ever login
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    // Persist streak update
    existingUser.loginStreak = {
      currentStreak,
      longestStreak,
      lastLoginDate: now,
    };
    await existingUser.save();

    // 5. Create JWT Payload
    const payload = {
      user: {
        id: existingUser._id,
      },
    };

    // 6. Sign JWT Token and Return Response
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          message: 'Login successful',
          token,
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            targetRole: existingUser.targetRole,
            loginStreak: {
              currentStreak,
              longestStreak,
              lastLoginDate: now,
            },
          },
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server Error during login' });
  }
});

// Import models for cascade deletion
const Resume = require('../models/Resume');
const Interview = require('../models/Interview');
const UserDSAProgress = require('../models/UserDSAProgress');
const { auth } = require('../middleware/auth');

// DELETE /api/auth/delete-account - Password Protected Account Deletion
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Please enter your password to confirm account deletion.' });
    }

    // 1. Fetch user from DB
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Account deletion cancelled.' });
    }

    // 3. Purge all user-related data from MongoDB
    await Promise.all([
      Resume.deleteMany({ userId: req.user.id }),
      Interview.deleteMany({ userId: req.user.id }),
      UserDSAProgress.deleteMany({ userId: req.user.id }),
      User.findByIdAndDelete(req.user.id),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
    });
  } catch (err) {
    console.error('Account Deletion Error:', err);
    return res.status(500).json({ message: 'Failed to delete account. Please try again.' });
  }
});

module.exports = router;