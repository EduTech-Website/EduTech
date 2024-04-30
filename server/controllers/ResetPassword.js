const User = require("../models/User");
const mailSender = require("../utils/mailSender");


//resetPasswordToken (generated reset link and mails it)
exports.reserPasswordToken = async(req, res) => {
    try {
        //get email from req id
        const email = req.body.mail;
        //check user for this mail, validate mail
        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"Your email is not registered",
            })
        }
        //generate token
        const token = crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {email : email},
            {
                token:token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new:true}); //new returns the updated documents
        //create URL
        const url = `http://localhost:3000/update-password/${token}`;
        //send mail containing the URL
        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);
        //return response
        return res.json({
            success:true,
            message:"Email sent successfully, please check email and change password",
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset mail",
        });
    }
}

//resetPassword
exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        const {password, confirmPassword, token} = req.body;
        //validation
        if(password !== confirmPassword) {
            return res.json({
                success:false,
                message:"Password not matching",
            });
        }
        //get user details from db using token
        const userDetails = await User.findOne({token: token});
        //if no entry - invalid token
        if(!userDetails) {
            return res.json({
                success:false,
                message:"Token is invalid",
            });
        }
        //token time check
        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success:false,
                message:"Token is expired, please regenerate your token",
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //update password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:"Password reset successful"
        });
    }
    catch(error) {
        console.log(error);
        return res.json({
            success:false,
            message:"Something went wrong while resetting password",
        });
    }
}