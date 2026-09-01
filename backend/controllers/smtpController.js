const User = require("../model/userModel.js");
const { sendOTP } = require("../config/nodemailer.js");
const { generateAndStoreOTP, verifyOTP, clearOTP } = require("../util/mailer.js");

const MAIL_WAIT_MS = Number(process.env.MAIL_WAIT_MS || 6000);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendMailWithBudget(sendPromise, budgetMs) {
    let sentWithinBudget = false;
    await Promise.race([
        sendPromise.then(() => {
            sentWithinBudget = true;
        }),
        wait(budgetMs),
    ]);
    return sentWithinBudget;
}

module.exports.sendResetOtp = async (req, res) =>{
    const {email} = req.body || {};
    if(!email) {
        return res.json({success: false, message: 'Email is required'});
    };
    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.json({success: false, message: 'User not found'});
        }

        // Generate and store OTP using Resend
        const otp = generateAndStoreOTP(email);

        const sendPromise = sendOTP(user.email, otp);

        let mailSentWithinBudget = false;
        try {
            mailSentWithinBudget = await sendMailWithBudget(sendPromise, MAIL_WAIT_MS);
        } catch (error) {
            console.error("sendResetOtp: sendMail failed", error);
            return res.json({ success: false, message: error?.message || "Failed to send OTP" });
        }

        // Respond (fast). If mail is still in-flight, it will continue in background.
        res.json({
            success: true,
            message: mailSentWithinBudget
                ? "OTP sent to your email"
                : "OTP request received. Email may take a few seconds — please check your inbox.",
        });

        // If the send is still running, attach a late-failure handler.
        if (!mailSentWithinBudget) {
            sendPromise.catch(async (error) => {
                console.error("sendResetOtp: sendMail failed (late)", error);
            });
        }
        
    } catch(error) {
        return res.json({success: false, message:error.message});
    }
};

// Verify OTP
module.exports.verifyOtp = async (req, res) => {
    const {email, otp} = req.body || {};
    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.json({ success: false, message: "User does not exist"});
        }

        // Verify OTP (don't delete yet - needed for password reset)
        const result = verifyOTP(email, otp, false);

        if (!result.valid) {
            return res.json({ success: false, message: result.message });
        }

        return res.json({success: true, message: "OTP Verified Successfully"});   
    } catch(error) {
        return res.json({success: false, message: error.message});
    }
};

// Reset User password
module.exports.resetPassword = async (req, res)=>{
    const {email, otp, newPassword} = req.body || {};
    if(!email || !otp || !newPassword) {
       return res.json({ success: false, message: "Email, OTP and NewPassword are required"});
    };
    try{
        const user = await User.findOne({email});
        if(!user) {
           return res.json({ success: false, message: "User not found"});
        }

        // Verify OTP using Resend OTP service (delete after successful verification)
        const result = verifyOTP(email, otp, true);

        if (!result.valid) {
            return res.json({ success: false, message: result.message });
        }

        // OTP verified, update password
        user.password = newPassword; // The pre('save') hook will hash this automatically!
        await user.save();

        // Clear OTP from storage (extra safety)
        clearOTP(email);

        return res.json({ success: true, message: "Password has been reset successfully"});
    } catch(error) {
        return res.json({success: false, message: error.message});
    };
};

  
