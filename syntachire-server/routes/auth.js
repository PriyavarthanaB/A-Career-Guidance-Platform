const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import models & services
const User = require('../models/User');
const OtpVerification = require('../models/OtpVerification');
const Resume = require('../models/Resume');
const Interview = require('../models/Interview');
const UserDSAProgress = require('../models/UserDSAProgress');
const { auth } = require('../middleware/auth');
const { sendSignupOtpEmail, sendPasswordResetEmail } = require('../utils/emailService');

// ==========================================
// 1. SIGNUP WITH EMAIL CONFIRMATION (OTP)
// ==========================================

// POST /api/auth/send-signup-otp - Step 1: Send OTP to verify email before registration
router.post('/send-signup-otp', async (req, res) => {
  const { name, email, password, targetRole } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (Name, Email, Password).' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists. Please log in.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    // Generate 6-digit numerical OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password for temporary storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Delete any old pending signup OTPs for this email
    await OtpVerification.deleteMany({ email: cleanEmail, type: 'signup' });

    // Store pending signup payload with 10-minute expiry
    await OtpVerification.create({
      email: cleanEmail,
      otp: otpCode,
      type: 'signup',
      payload: {
        name: name.trim(),
        password: hashedPassword,
        targetRole: targetRole || 'Full Stack Developer',
      },
    });

    // Send confirmation email from syntachire.ai@gmail.com
    const emailResult = await sendSignupOtpEmail(cleanEmail, name.trim(), otpCode);

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}. Please enter it to confirm your account.`,
      email: cleanEmail,
      devOtp: emailResult.fallback ? emailResult.otp : undefined,
    });
  } catch (err) {
    console.error('Send Signup OTP Error:', err);
    res.status(500).json({ message: 'Server error sending confirmation email. Please try again.' });
  }
});

// POST /api/auth/verify-signup-otp - Step 2: Verify OTP and create user
router.post('/verify-signup-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide both email and verification code.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find OTP record
    const record = await OtpVerification.findOne({
      email: cleanEmail,
      otp: otp.trim(),
      type: 'signup',
    });

    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired verification code. Please request a new code.' });
    }

    const { name, password, targetRole } = record.payload;

    // Create and save new verified user
    const newUser = new User({
      name,
      email: cleanEmail,
      password,
      targetRole: targetRole || 'Full Stack Developer',
      loginStreak: {
        currentStreak: 1,
        longestStreak: 1,
        lastLoginDate: new Date(),
      },
    });

    await newUser.save();

    // Delete OTP record after successful verification
    await OtpVerification.deleteOne({ _id: record._id });

    // Sign JWT
    const payload = {
      user: {
        id: newUser._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          message: 'Email confirmed and account created successfully!',
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            targetRole: newUser.targetRole,
            loginStreak: newUser.loginStreak,
          },
        });
      }
    );
  } catch (err) {
    console.error('Verify Signup OTP Error:', err);
    res.status(500).json({ message: 'Server error during verification. Please try again.' });
  }
});

// Direct register fallback endpoint (for backwards compatibility)
router.post('/register', async (req, res) => {
  const { name, email, password, targetRole } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: cleanEmail,
      password: hashedPassword,
      targetRole: targetRole || 'Full Stack Developer',
      loginStreak: {
        currentStreak: 1,
        longestStreak: 1,
        lastLoginDate: new Date(),
      },
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser._id,
      },
    };

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
            loginStreak: newUser.loginStreak,
          },
        });
      }
    );
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ message: 'Server Error during registration' });
  }
});

// ==========================================
// 2. FORGOT & RESET PASSWORD FLOW
// ==========================================

// POST /api/auth/forgot-password - Step 1: Send 6-digit OTP to user's email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Please enter your registered email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any previous password reset OTPs for this email
    await OtpVerification.deleteMany({ email: cleanEmail, type: 'reset-password' });

    // Store OTP in database with 10-minute expiry
    await OtpVerification.create({
      email: cleanEmail,
      otp: otpCode,
      type: 'reset-password',
    });

    // Send reset email via syntachire.ai@gmail.com
    const emailResult = await sendPasswordResetEmail(cleanEmail, user.name, otpCode);

    res.status(200).json({
      success: true,
      message: `Password reset code sent to ${cleanEmail}. Please check your inbox.`,
      email: cleanEmail,
      devOtp: emailResult.fallback ? emailResult.otp : undefined,
    });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Server error processing password reset request.' });
  }
});

// POST /api/auth/reset-password - Step 2: Verify OTP and set new password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, verification code, and new password.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify OTP
    const record = await OtpVerification.findOne({
      email: cleanEmail,
      otp: otp.trim(),
      type: 'reset-password',
    });

    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired verification code. Please request a new code.' });
    }

    // Find and update user password
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Delete used OTP
    await OtpVerification.deleteOne({ _id: record._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Server error resetting password. Please try again.' });
  }
});

// ==========================================
// 3. LOGIN ENDPOINT
// ==========================================

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all credentials.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid credentials. No user found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Wrong password.' });
    }

    // Update streak
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
        currentStreak += 1;
      } else if (diffDays === 0) {
        // Same day
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    existingUser.loginStreak = {
      currentStreak,
      longestStreak,
      lastLoginDate: now,
    };
    await existingUser.save();

    const payload = {
      user: {
        id: existingUser._id,
      },
    };

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
            loginStreak: existingUser.loginStreak,
          },
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server Error during login' });
  }
});

// ==========================================
// 4. PROFILE, PASSWORD & ACCOUNT MANAGEMENT
// ==========================================

// PUT /api/auth/profile - Update User Profile Data
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, targetRole, bio, college, graduationYear, linkedin, github } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name;
    if (targetRole) user.targetRole = targetRole;
    if (bio !== undefined) user.bio = bio;
    if (college !== undefined) user.college = college;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        bio: user.bio,
        college: user.college,
        graduationYear: user.graduationYear,
        linkedin: user.linkedin,
        github: user.github,
      },
    });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
});

// PUT /api/auth/change-password - Update User Password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please enter both current and new passwords.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password does not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    console.error('Change Password Error:', err);
    res.status(500).json({ message: 'Server error changing password.' });
  }
});

// DELETE /api/auth/delete-account - Password Protected Account Deletion
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Please enter your password to confirm account deletion.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Account deletion cancelled.' });
    }

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
