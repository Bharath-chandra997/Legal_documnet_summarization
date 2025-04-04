const express = require("express");
const passport = require("passport");
const { 
  signup, 
  signin, 
  googleAuth, 
  googleCallback, 
  getMe,
  verifyOTP,
  forgotPassword, // New controller
  resetPassword ,  // New controller,
  verifyResetOtp,requestNewOtp
} = require("../controler/UserControler");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verify-otp", verifyOTP);
router.get("/google", googleAuth);
router.get("/google/callback", 
  passport.authenticate("google", { 
    failureRedirect: "http://localhost:3000/signup" 
  }), 
  googleCallback
);
router.get("/me", getMe);
router.post("/request-new-otp", requestNewOtp);
router.post("/ForgetPassword", forgotPassword); // New route
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/ResetPassword", resetPassword);   // New route

module.exports = router;