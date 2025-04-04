import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check token existence and expiry on component mount
    const token = localStorage.getItem("resetToken");
    const expiry = localStorage.getItem("tokenExpiry");
    
    if (!token || Date.now() > parseInt(expiry)) {
      localStorage.removeItem("resetToken");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("resetEmail");
      toast.error("Session expired. Please request a new OTP.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => navigate("/forgot-password"), 3000);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const token = localStorage.getItem("resetToken");

    try {
      const response = await fetch("http://localhost:8080/auth/ResetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      if (response.ok) {
        localStorage.removeItem("resetToken");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("resetEmail");
        toast.success("Password reset successful! Redirecting to signin...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => navigate("/signin")
        });
      } else {
        const error = await response.json();
        toast.error(error.message || "Password reset failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="reset-password-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="resetforgotcard">
        <div className="resetforgotform-container">
          <h1 className='resetforgotheadingH1'>Reset Password</h1>
          <p>Enter your new password below.</p>
          <div className="resetforgotinput-container">
            <input 
              type="password" 
              placeholder="New password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="resetforgotinput-container">
            <input 
              type="password" 
              placeholder="Confirm new password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button 
            className="resetforgotreset-button" 
            onClick={handleSubmit}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;