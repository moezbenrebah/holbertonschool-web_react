const User = require("../models/User");
const bcrypt = require("bcryptjs"); // for hashing passwords
const jwt = require("jsonwebtoken"); // generating authentication tokens
const crypto = require("crypto"); // generating verification tokens
const nodemailer = require("nodemailer"); // for sending verification email

// Create email transporter using Gmail SMTP 
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Gmail SMTP server
  port:465,
  secure: true, // use SSL security protocol
  auth: {
    user: process.env.EMAIL_USERNAME, // email from .env
    pass: process.env.EMAIL_PASSWORD  // p.w from .env
  }
});

// handle new user register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists with same email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

     // Generate email verification token valid for 24 hours
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user in database 
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires
    });

    // build email verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    
    // Compose email message
    const mailOptions = {
      from: `"ShutterUp" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Verify Your Email',
      text: `Verify your email: ${verificationUrl}`,
      html: `<h2>Welcome to ShutterUp!</h2>
        <a href="${verificationUrl}">Click here to verify</a>
        <p><small>Link expires in 24 hours.</small></p>
      </div>`,
  
    };

    // Send email notic on terminal 
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");


    // Generate JWT token (can be used after email verification)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Send response with token and user info (appear on signup form)
    res.status(201).json({ 
      message: " Verification sent, please verify your mail",
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// handle verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // find the user  with valid (non expire token)
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // mark user as verified and clear token fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json("Email verified successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
};

// handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // check if user email is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: "Please verify your email first. Check your inbox for the verification link."
      });
    }

    // check password and compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Send response with token and user info
    res.status(201).json({ 
      message: "Registration successful! Please check your email to verify your account.",
      token,
      user
    });
  } catch (err) {
    console.error(" Email error or user creation issue:", err); // Enhanced logging
    res.status(500).json({ message: "Server Error" });
  }
};


