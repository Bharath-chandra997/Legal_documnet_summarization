require("dotenv").config();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { Strategy: OAuth2Strategy } = require("passport-google-oauth2");
const nodemailer = require("nodemailer");

// Validate environment variables
if (!process.env.CLIENT_ID) throw new Error("CLIENT_ID is not defined in .env");
if (!process.env.CLIENT_SECRET) throw new Error("CLIENT_SECRET is not defined in .env");
if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL is not defined in .env");
if (!process.env.EMAIL_USER) throw new Error("EMAIL_USER is not defined in .env");
if (!process.env.EMAIL_PASS) throw new Error("EMAIL_PASS is not defined in .env");

// Log configuration
console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);
console.log("Callback URL:", "http://localhost:8080/auth/google/callback");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Must be an App Password
  },
});

// Configure Google OAuth Strategy (unchanged)
passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
      scope: ["profile", "email"],
      prompt: "select_account",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth - Access Token:", accessToken);
        console.log("Google OAuth - Profile:", profile);
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            username: profile.displayName,
            email,
            image: profile.photos[0].value,
            isVerified: true, // Google users are auto-verified
          });
          await user.save();
          console.log("Google OAuth - Created new user:", email);
        } else {
          console.log("Google OAuth - User exists:", email);
        }
        return done(null, user);
      } catch (error) {
        console.error("Google OAuth - Callback Error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize/deserialize user (unchanged)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Generate OTP (unchanged)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Send OTP email (unchanged)
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Signup Verification",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  };
  await transporter.sendMail(mailOptions);
  console.log("OTP sent to:", email);
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = req.body.password;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: "Server error" });
  }
};
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = generateOTP();
    if (user) {
      // Update existing unverified user
      user.username = username;
      user.password = password; // Will be hashed by pre-save
      user.otp_verification = otp;
      user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    } else {
      // Create new pending user
      user = new User({
        username,
        email,
        password, // Will be hashed by pre-save
        otp_verification: otp,
        otpExpiresAt: Date.now() + 5 * 60 * 1000,
        isVerified: false,
      });
    }
    await user.save();

    await sendOTP(email, otp);
    console.log("Signup initiated, OTP sent:", email);
    res.status(201).json({ message: "OTP sent, please verify", email });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
};
const requestNewOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    // Generate new OTP and set expiration (5 minutes)
    const otp = generateOTP();
    user.otp_verification = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
    await user.save();

    // Send the new OTP to the user's email
    await sendOTP(email, otp);

    res.json({ message: "New OTP sent to your email" });
  } catch (error) {
    console.error("Request new OTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Verify OTP (unchanged)
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp_verification !== otp || Date.now() > user.otpExpiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Finalize signup: mark as verified and clear OTP
    user.otp_verification = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ username: user.username, email }, process.env.JWT_SECRET, { expiresIn: "24h" });
    console.log("OTP verified, user fully registered:", email);
    res.json({ message: "Signup completed", token, email });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: error.message });
  }
};
// controler/UserControler.js
const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ 
      email,
      resetOtp: otp,
      resetotpExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Clear the OTP after successful verification
    user.resetOtp = undefined;
    user.resetotpExpiresAt = undefined;
    await user.save();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Signin (unchanged)
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      console.error("User does not exist or is not verified:", email);
      return res.status(404).json({ error: "User does not exist or is not verified. Please sign up and verify." });
    }
    if (!(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ username: user.username, email }, process.env.JWT_SECRET, { expiresIn: "24h" });
    console.log("Signin successful:", email);
    res.json({ message: "Sign in successful", token, email });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Google Auth (unchanged)
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

// Google Callback (unchanged)
const googleCallback = async (req, res) => {
  if (!req.user) {
    console.error("Google OAuth - No user authenticated");
    return res.redirect(`${process.env.CLIENT_URL}/signup?status=error`);
  }

  const { username, email } = req.user;
  const token = jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: "24h" });
  console.log("Google OAuth - Redirecting to Dash with:", email);
  res.redirect(`${process.env.CLIENT_URL}?token=${token}&email=${email}`);
};

// Get Me (unchanged)
const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ username: user.username, email: user.email, image: user.image });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(404).json({ error: "User not found or not verified" });
    }

    // Generate OTP
    const otp = generateOTP();
    user.resetOtp = otp;
    user.resetotpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It expires in 5 minutes.`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { 
  signup, 
  signin, 
  googleAuth, 
  googleCallback, 
  getMe, 
  verifyOTP, 
  forgotPassword, 
  resetPassword ,verifyResetOtp,requestNewOtp
};