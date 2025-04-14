require("dotenv").config();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { Strategy: OAuth2Strategy } = require("passport-google-oauth2");
const UserLoginStats = require('../model/UserLoginStats');
const nodemailer = require("nodemailer");

// Validate environment variables
if (!process.env.CLIENT_ID) throw new Error("CLIENT_ID is not defined in .env");
if (!process.env.CLIENT_SECRET) throw new Error("CLIENT_SECRET is not defined in .env");
if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL is not defined in .env");
if (!process.env.EMAIL_USER) throw new Error("EMAIL_USER is not defined in .env");
if (!process.env.EMAIL_PASS) throw new Error("EMAIL_PASS is not defined in .env");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined in .env");

// Log configuration
console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);
console.log("Callback URL:", "http://localhost:8080/auth/google/callback");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: '"LExiMinD Support" <leximind1.0@gmail.com>',
    to: email,
    subject: "Your OTP for Signup Verification",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  };
  await transporter.sendMail(mailOptions);
  console.log("OTP sent to:", email);
};

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
  await transporter.sendMail({
    from: '"LExiMinD Support" <leximind1.0@gmail.com>',
    to: email,
    subject: "Welcome to LExiMinD - Your AI-Powered Legal Research Assistant",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748;">Welcome to LExiMinD, ${username}!</h2>
        
        <p>We're thrilled to have you join our platform that revolutionizes legal research through AI technology.</p>
        
        <h3 style="color: #4a5568;">What LExiMinD Offers:</h3>
        <ul>
          <li><strong>Instant Case Summarization</strong>: Upload legal judgments and get concise AI-generated summaries</li>
          <li><strong>Smart Legal Q&A</strong>: Ask case-specific questions and get precise answers from our RAG-powered system</li>
          <li><strong>Multilingual Support</strong>: Access summaries and answers in multiple languages</li>
          <li><strong>Document Management</strong>: Securely store and organize your legal research</li>
        </ul>
        
        <p>Your account is ready! Start exploring how LExiMinD can streamline your legal research workflow today.</p>
        
        <div style="margin-top: 2rem; padding: 1rem; background-color: #f7fafc; border-radius: 0.5rem;">
          <p>Need help? Contact our support team at <a href="mailto:leximind1.0@gmail.com">leximind1.0@gmail.com</a></p>
        </div>
      </div>
    `
  });
  console.log("Welcome email sent to:", email);
};

// Configure Google OAuth Strategy
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
            isVerified: true,
          });
          await user.save();
          await sendWelcomeEmail(email, user.username);
          console.log("Google OAuth - Created new user:", email);
        } else {
          // Update image if it exists
          if (profile.photos[0].value) {
            user.image = profile.photos[0].value;
            await user.save();
          }
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

// Serialize/deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = generateOTP();
    if (user) {
      user.username = username;
      user.password = password;
      user.otp_verification = otp;
      user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    } else {
      user = new User({
        username,
        email,
        password,
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
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }
    const otp = generateOTP();
    user.otp_verification = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    await user.save();
    await sendOTP(email, otp);
    res.json({ message: "New OTP sent to your email" });
  } catch (error) {
    console.error("Request new OTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp_verification !== otp || Date.now() > user.otpExpiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    user.isVerified = true;
    user.otp_verification = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    
    // Send welcome email after verification
    await sendWelcomeEmail(email, user.username);

    const token = jwt.sign(
      { 
        username: user.username, 
        email, 
        image: user.image || null, 
        isAdmin: user.isAdmin || false 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log("OTP verified, user fully registered:", email);
    res.json({ 
      message: "Signup completed", 
      token, 
      email, 
      image: user.image || null,
      isAdmin: user.isAdmin 
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: error.message });
  }
};

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
    if (!user.isAdmin) {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await UserLoginStats.findOneAndUpdate(
          { date: today },
          { $inc: { count: 1 } },
          { upsert: true, new: true }
        );
        console.log("Login tracked for non-admin user:", email);
      } catch (err) {
        console.error('Login tracking failed:', err.message);
      }
    } else {
      console.log("Admin login not tracked for:", email);
    }

    const tokenExpiry = user.isAdmin ? "3h" : "24h";
    const token = jwt.sign(
      { 
        username: user.username, 
        email, 
        image: user.image || null, 
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    console.log("Signin successful:", email);
    res.json({ 
      message: "Sign in successful", 
      token, 
      email,
      image: user.image || null,
      isAdmin: user.isAdmin,
      expiresIn: tokenExpiry
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: error.message });
  }
};

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

const googleCallback = async (req, res) => {
  if (!req.user) {
    console.error("Google OAuth - No user authenticated");
    return res.redirect(`${process.env.CLIENT_URL}/signup?status=error`);
  }

  const { username, email, image } = req.user;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error("Google OAuth - User not found in database:", email);
      return res.redirect(`${process.env.CLIENT_URL}/signup?status=error`);
    }

    if (!user.isAdmin) {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await UserLoginStats.findOneAndUpdate(
          { date: today },
          { $inc: { count: 1 } },
          { upsert: true, new: true }
        );
        console.log("Google OAuth login tracked for non-admin user:", email);
      } catch (err) {
        console.error('Login tracking failed:', err.message);
      }
    } else {
      console.log("Google OAuth admin login not tracked for:", email);
    }

    const tokenExpiry = user.isAdmin ? "3h" : "24h";
    const token = jwt.sign(
      { 
        username, 
        email, 
        image: user.image || null, 
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );
    console.log("Google OAuth - Redirecting with:", { email, image: user.image });
    res.redirect(`${process.env.CLIENT_URL}?token=${token}&email=${email}&image=${encodeURIComponent(user.image || '')}`);
  } catch (error) {
    console.error("Google OAuth error:", error.message);
    res.redirect(`${process.env.CLIENT_URL}/signup?status=error`);
  }
};

const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ 
      username: user.username, 
      email: user.email, 
      image: user.image || null, 
      isAdmin: user.isAdmin 
    });
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
    const otp = generateOTP();
    user.resetOtp = otp;
    user.resetotpExpiresAt = Date.now() + 5 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: '"LExiMinD Support" <leximind1.0@gmail.com>',
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
    user.resetOtp = undefined;
    user.resetotpExpiresAt = undefined;
    await user.save();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
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

module.exports = { 
  signup, 
  signin, 
  googleAuth, 
  googleCallback, 
  getMe, 
  verifyOTP, 
  forgotPassword, 
  resetPassword,
  verifyResetOtp,
  requestNewOtp
};