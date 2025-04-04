import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ResetOtp.css";

const ResetOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  useEffect(() => {
    const resetEmail = location.state?.email || localStorage.getItem("resetEmail");
    if (!resetEmail) {
      navigate("/ForgetPassword");
      return;
    }
    setEmail(resetEmail);
    localStorage.setItem("resetEmail", resetEmail);
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [navigate, location]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input when a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit when all digits are entered
    if (newOtp.every(digit => digit !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1].focus();
    }
    // Handle right arrow
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteArray = pasteData.split('').slice(0, 6);
      setOtp(pasteArray);
      verifyOtp(pasteData);
    }
  };

  const verifyOtp = async (fullOtp) => {
    try {
      const response = await fetch("http://localhost:8080/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });
  
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("resetToken", result.token);
        localStorage.setItem("tokenExpiry", Date.now() + 15*60*1000);
        toast.success("OTP verified! Redirecting...", {
          autoClose: 2000,
          onClose: () => navigate("/ResetPassword")
        });
      } else {
        toast.error(result.message || "Invalid OTP", {
          position: "top-right",
          autoClose: 5000,
        });
        // Clear all inputs and focus first one on error
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      }
    } catch (error) {
      toast.error("Network error. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const resendOtp = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/ForgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        toast.success("New OTP sent!", {
          position: "top-right",
          autoClose: 3000,
        });
        // Clear inputs and focus first one when resending
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      } else {
        const result = await response.json();
        toast.error(result.error || "Failed to resend OTP", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Failed to resend. Try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="otp-card">
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
      
      <div className="otp-container">
        <h2>Password Reset Verification</h2>
        <p>Enter the OTP sent to <strong>{email}</strong></p>
        
        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              id={`reset-otp-input-${index}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <p className="otp-request">
          Didn't receive code?{" "}
          <span 
            className="resend-link"
            style={{ color: "blue", cursor: "pointer" }} 
            onClick={resendOtp}
          >
            Request again
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetOtp;