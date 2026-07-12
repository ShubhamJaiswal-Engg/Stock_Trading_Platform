import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002';

/**
 * Send OTP to user's email via backend (stores OTP securely in MongoDB)
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendOTPEmail = async (email) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/forget-password`, { email });
    return {
      success: response.data.success || false,
      message: response.data.message || 'OTP sent successfully!',
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
    };
  }
};

/**
 * Verify OTP with backend (checks against MongoDB stored OTP)
 * @param {string} email - User email
 * @param {string} otp - OTP code to verify
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/verify-otp`, { email, otp });
    return {
      success: response.data.success || false,
      message: response.data.message || 'OTP verification failed.',
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error verifying OTP. Please try again.',
    };
  }
};

/**
 * Reset password after OTP verification (backend validates OTP again for security)
 * @param {string} email - User email
 * @param {string} otp - Verified OTP
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const resetPasswordWithOTP = async (email, otp, newPassword) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/reset-password`, {
      email,
      otp,
      newPassword,
    });
    return {
      success: response.data.success || false,
      message: response.data.message || 'Password reset successfully!',
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reset password. Please try again.',
    };
  }
};
