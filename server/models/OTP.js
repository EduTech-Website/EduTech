const mongoose = require("mongoose");
const mailSender = require("../utils/mailsender");

const OTPSchema = new mongoose.model({
    email: {
        type:String,
        required:true,
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 5*60,
    },
});

// Function to send emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification email from Edu-Tech", otp);
        console.log("Email sent successfully", mailResponse);
    }
    catch(error) {
        console.log("error occured while sending mail :", error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);