const User = require("../model/userModel.js");
const transporter = require("../config/nodemailer");

const MAIL_WAIT_MS = Number(process.env.MAIL_WAIT_MS || 6000);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function buildOtpMailOptions(userEmail, otp) {
    return {
        from:
            process.env.SENDER_EMAIL ||
            process.env.SMTP_USER ||
            process.env.BREVO_SMTP_USER ||
            process.env.BREVO_SMTP_LOGIN,
        to: userEmail,
        subject: "Password Reset Otp",
        text: `Your otp for reseting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
    };
}

async function invalidateResetOtp(user) {
    user.resetOtp = "";
    user.resetOtpExpiresAt = 0;
    await user.save();
}

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
    // console.log(email)
    if(!email) {
        return res.json({success: false, message: 'Email is required'});
    };
    try{
        const user = await User.findOne({email});
        if(!user) {
        return res.json({success: false, message: 'User not found'});
        }
        const otp = generateOtp();
        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = buildOtpMailOptions(user.email, otp);
        const sendPromise = transporter.sendMail(mailOptions);

        let mailSentWithinBudget = false;
        try {
            mailSentWithinBudget = await sendMailWithBudget(sendPromise, MAIL_WAIT_MS);
        } catch (error) {
            // If sending fails quickly, invalidate OTP so user can request again.
            try {
                await invalidateResetOtp(user);
            } catch (_e) {
                // ignore
            }
            console.error("sendResetOtp: sendMail failed", error);
            return res.json({ success: false, message: error?.message || "Failed to send OTP" });
        }

        // Respond (fast). If mail is still in-flight, it will continue in background.
        res.json({
            success: true,
            message: mailSentWithinBudget
                ? "Otp sent to your email"
                : "OTP request received. Email may take a few seconds — please check your inbox.",
        });

        // If the send is still running, attach a late-failure handler.
        if (!mailSentWithinBudget) {
            sendPromise.catch(async (error) => {
                // Don't invalidate OTP on late failures; otherwise the OTP looks "instantly expired".
                // User can still retry/resend if they don't receive the email.
                console.error("sendResetOtp: sendMail failed (late)", error);
            });
        }
        
    } catch(error) {
        return res.json({success: false, message:error.message});
    }
};
// Request for Otp
module.exports.verifyOtp = async (req, res) => {
    const {email,otp} = req.body || {};
    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP is required" });
    }
    const user = await User.findOne({email});
    if(!user) {
        return res.json({ success: false, message:"User does not exist"});
    }

    // If no OTP was generated (or it was cleared), ask user to resend.
    if (!user.resetOtp || !user.resetOtpExpiresAt) {
        return res.json({ success: false, message: "OTP not requested. Please resend OTP" });
    }

    if(user.resetOtpExpiresAt < Date.now()) {
        return res.json({ success: false, message: "OTP Expired"});
    }
    if(user.resetOtp !== String(otp)) {
        return res.json({ success: false, message: "Invalid OTP"});
    }

     return res.json({success:true, message:"Otp Verified Succesfully"});   
}

// Reset User password
module.exports.resetPassword = async (req, res)=>{
    const {email,otp,newPassword} = req.body || {};
    if(!email || !otp || !newPassword) {
       return res.json({ success: false, message: "Email, OTP and NewPassword is required"});
    };
    try{
        const user = await User.findOne({email});
        if(!user) {
           return res.json({ success: false, message: "User not found"});
        }

          if (!user.resetOtp || !user.resetOtpExpiresAt) {
                return res.json({ success: false, message: "OTP not requested. Please resend OTP" });
          }
        if(user.resetOtpExpiresAt < Date.now()) {
           return res.json({ success: false, message: "OTP Expired"});
        }
          if(user.resetOtp !== String(otp)) {
           return res.json({ success: false, message: "Invalid OTP"});
        }

        user.password = newPassword; // The pre('save') hook will hash this automatically!
        user.resetOtp = '' ;
        user.resetOtpExpiresAt = 0 ;

        await user.save();

            return res.json({ success: true, message: "Password has been reset successfully "});
    } catch(error) {
            return res.json({success: false, message:error.message});
    };
};

  
