import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Otp.css";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      navigate("/signup");
      return;
    }
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [navigate]);

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
      const email = localStorage.getItem("email");
      const response = await fetch("http://localhost:8080/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("OTP verified successfully!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => {
            localStorage.setItem("token", result.token);
            navigate("/signin");
          }
        });
      } else {
        toast.error(result.error || "Invalid OTP. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
        // Clear all inputs and focus first one on error
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      }
    } catch (error) {
      toast.error("Error verifying OTP. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("OTP verification error:", error);
    }
  };

  const requestNewOtp = async () => {
    try {
      setIsResending(true);
      const email = localStorage.getItem("email");
      if (!email) {
        toast.error("No email found. Please sign up again.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      const response = await fetch("http://localhost:8080/auth/request-new-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("New OTP sent to your email.", {
          position: "top-right",
          autoClose: 3000,
        });
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      } else {
        toast.error(result.error || "Failed to request new OTP.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Error requesting new OTP. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Request new OTP error:", error);
    } finally {
      setIsResending(false);
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
        <h2>Verify Your Account</h2>
        <p>Enter the 6-digit code sent to <strong>{localStorage.getItem("email")}</strong></p>
        
        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              id={`otp-input-${index}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`otp-input ${digit ? 'has-value' : ''}`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <p className="otp-request">
          Didn't receive code?{" "}
          <button 
            className={`otp-resend-btn ${isResending ? 'loading' : ''}`}
            onClick={requestNewOtp}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Code'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Otp;