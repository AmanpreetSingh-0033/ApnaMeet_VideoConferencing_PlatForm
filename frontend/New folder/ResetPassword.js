const User = require("../models/User");
const mailSender = require("../utilities/mailSender");
const bcrypt = require("bcrypt");

//fn -> resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from request body
    const { email } = req.body;

    //check user for this email, email validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpire: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail containing the url
    await mailSender(
      email,
      "Password Reset Request",
      `Password Reset Link: ${url}`
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Email Sent Successfully. Please check the mailbox.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to reset password. Please try again later.",
    });
  }
};

//resetpassword
exports.resetPassword = async (req, res) => {
  try {
    //data fetch //aithe token front end ne chak ke body ch paa taa
    const { password, confirmPassword, token } = req.body;

    //validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm password are not matching.",
      });
    }

    //get userdetails from db using token
    const userDetails = await User.findOne({ token: token });

    //if no entry -> either invalid token or token expires
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Token is invalid.",
      });
    }

    //token time check
    if (userDetails.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token expired. Please regenerate your token.",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //update password
    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Password Reset Successful.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset Password.",
    });
  }
};
