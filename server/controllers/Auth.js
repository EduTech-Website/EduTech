const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");

//sendOTP
exports.sendOTP = async (req, res) => {

    try {
        //fetch email from req ki body
        const {email} = req.body;

        //check if user already exists
        const checkUserPresent = await User.findOne({email});
        
        //if user already exists then send response
        if(checkUserPresent) {
            return res.status(401).json({
                success:false,
                message:"User already registered",
            });
        }

        //generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ", otp);

        //check otp unique or not
        let result = await OTP.findOne({otp: otp});
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        //create an entry in db for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response succesfully
        res.status(200).json({
            success:true,
            message:"OTP Sent Successfully",
            otp,
        });
    }
    catch(error) {
        console.log(error),
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }

}

//signup
exports.signUp = async (req, res) => {
    try{
        //data fetch from req ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
        //validate
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            res.status(403).json({
                success:false,
                message:"All fields are required",
            });
        }
        //match 2 passwords
        if(password !== confirmPassword) {
            res.status(400).json({
                success:false,
                message:"Password and Confirm Password values does not match, please try again",
            });
        }
        //check user already exists or not
        const existUser = await User.findOne({email});
        if(existUser) {
            res.status(400).json({
                success:false,
                message:"User is already registered",
            });
        }

        //find most recent OTP stored for the user
        const mostRecentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOTP);
        //validate OTP
        if(recentOTP.length == 0) {
            //OTP not found
            res.status(400).json({
                success:false,
                message:"OTP not found",
            });
        } else if(otp !== recentOTP.otp) {
            //invalid OTP
            res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create entry in DB
        const profileDetail = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return res
        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again",
        })
    }
}

//login
exports.login = async (req, res) => {
    try{
        //get data from req body
        const {email, password} = req.body;
        //validate data
        if(!email || !password) {
            return res.status(403).json({
                success:false,
                message:"All fields are required, please try again",
            });
        }
        //check user exists or not
        const user = await User.findOne({email}).populate("additonalDetails");
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not registered, please sign up first",
            });
        }
        //generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;
            //create cookie and send response
            const options = {
                expires: new Date(date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            });
        }
        else {
            return res.status(401).json({
                success:false,
                message:"Password is Incorrect",
            });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure, please try again",
        });
    }
}

//changePassword
exports.changePassword = async(req, res) => {
    try {
        //get data from req body
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        //validation
        if(!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            });
        }

        //get user
        const userDetails = await User.findById(req.user.id);

        //validating old password is correct or not
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )

        //if old password did not match
        if(!isPasswordMatch) {
            return res.status(401).json({
                success:false,
                message:"Old password is incorrect",
            });
        }

        //check both passwords are matched
        if(newPassword !== confirmNewPassword) {
            return res.status(403).json({
                success:false,
                message:"Password and confirm password did not match",
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //update password in DB
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id, 
            {password: hashedPassword},
            {new: true},
        );
        //send mail - password updated
        try {
            const emailResponse = await mailSender(
                updatedUserDetails,
                "Password for your account has been updated",
                "Hi your password is updated successfully, please inform if you did not make an attempt to change the password"
            );
            console.log("Email sent successfully: ", emailResponse);
        }
        catch(error) {
            return res.status(500).json({
                success:false,
                message:"Error occured while sending mail",
                error:error.message,
            });
        }
        //return response
        return res.status(200).json({
            success:true,
            message:"Password changed successfully",
        });
    }
    catch(error) {
        console.log("Error while sending mail");
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error while changing password",
            error:error.message,
        });
    }
}