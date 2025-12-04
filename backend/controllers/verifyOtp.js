import jwt from 'jsonwebtoken';
import { otpStore, hashOTP } from './sendOtp.js';

/**
 * Verify OTP and generate JWT token
 */
export async function verifyOtp(req, res) {
  try {
    // Accept both 'phone' and 'mobile' for compatibility
    const phone = req.body.phone || req.body.mobile;
    const otp = req.body.otp;

    // Validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format. Must be 6 digits',
      });
    }

    // Get stored OTP data
    const storedData = otpStore.get(phone);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new OTP',
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiry) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP',
      });
    }

    // Verify OTP
    const hashedInputOTP = hashOTP(otp);
    if (hashedInputOTP !== storedData.hashedOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // OTP verified successfully - remove from store
    otpStore.delete(phone);

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    const token = jwt.sign(
      {
        phone,
        type: 'otp_login',
      },
      jwtSecret,
      {
        expiresIn: '7d',
      }
    );

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

