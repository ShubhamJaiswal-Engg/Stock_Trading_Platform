// In-memory OTP storage (for production, use Redis or database)
const otpStore = new Map();

const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Generate and store OTP
 * @param {string} email - User email
 * @param {number} length - OTP length (default: 6)
 * @returns {string} Generated OTP
 */
function generateAndStoreOTP(email, length = 6) {
  // Generate OTP
  const otp = Math.floor(
    Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))
  ).toString();

  // Store OTP with expiry
  const expiryTime = Date.now() + OTP_EXPIRY_TIME;
  otpStore.set(email, {
    otp,
    expiryTime,
    attempts: 0,
  });

  return otp;
}

/**
 * Verify OTP (without deleting)
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 * @param {boolean} deleteAfterVerify - Delete OTP after successful verification (default: false)
 * @returns {object} { valid: boolean, message: string }
 */
function verifyOTP(email, otp, deleteAfterVerify = false) {
  if (!otpStore.has(email)) {
    return { valid: false, message: 'OTP not found or expired' };
  }

  const storedData = otpStore.get(email);

  // Check if OTP has expired
  if (Date.now() > storedData.expiryTime) {
    otpStore.delete(email);
    return { valid: false, message: 'OTP has expired' };
  }

  // Check max attempts (5 attempts allowed)
  if (storedData.attempts >= 5) {
    otpStore.delete(email);
    return { valid: false, message: 'Maximum attempts exceeded. Request a new OTP' };
  }

  // Verify OTP
  if (storedData.otp === otp.toString()) {
    if (deleteAfterVerify) {
      otpStore.delete(email);
    } else {
      // Mark as verified but keep in store for password reset
      storedData.verified = true;
    }
    return { valid: true, message: 'OTP verified successfully' };
  }

  // Increment attempts
  storedData.attempts += 1;
  return { valid: false, message: `Invalid OTP. ${5 - storedData.attempts} attempts remaining` };
}

/**
 * Get remaining time for OTP
 * @param {string} email - User email
 * @returns {number} Remaining time in seconds
 */
function getOTPExpiryTime(email) {
  if (!otpStore.has(email)) {
    return 0;
  }

  const storedData = otpStore.get(email);
  const remainingTime = Math.max(0, storedData.expiryTime - Date.now());
  return Math.ceil(remainingTime / 1000);
}

/**
 * Clear OTP for an email
 * @param {string} email - User email
 */
function clearOTP(email) {
  otpStore.delete(email);
}

module.exports = {
  generateAndStoreOTP,
  verifyOTP,
  getOTPExpiryTime,
  clearOTP,
};
