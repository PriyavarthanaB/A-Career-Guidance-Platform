const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  type: { type: String, enum: ['signup', 'reset-password'], required: true },
  payload: { type: Object, default: {} }, // Can hold name, password hash, targetRole for pending signups
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Automatically expires in 10 minutes (600s)
});

module.exports = mongoose.model('OtpVerification', otpVerificationSchema);
