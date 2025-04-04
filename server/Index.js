require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/UserRoutes");
const nodemailer = require("nodemailer");
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(session({
  secret: process.env.JWT_SECRET || "secret-123",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
    httpOnly: true,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// Mount routes
app.use("/auth", authRoutes);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "test@example.com", // Replace with your email for testing
  subject: "Test Email",
  text: "This is a test email from Nodemailer!",
}, (err, info) => {
  if (err) {
    console.error("Email sending error:", err);
  } else {
    console.log("Email sent:", info.response);
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_CONN)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));