import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Upload, FileText, Download, MessageSquare, 
  HelpCircle, BookOpen, Users, ShieldCheck, 
  Lightbulb, Facebook, Twitter, Instagram, 
  Linkedin, User, LogOut 
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Dash.css";

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(window.atob(base64));
    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export default function Dash() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "User",
    email: "user@example.com"
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      const decodedToken = decodeJWT(token);
      if (decodedToken) {
        const username = decodedToken.username || decodedToken.name || "User";
        const email = storedEmail || decodedToken.email || "user@example.com";
        
        // Show welcome toast with username from localStorage
        if (storedUsername) {
          toast.success(`Welcome , ${storedUsername}!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          localStorage.setItem("username", username);
          toast.success(`Welcome, ${username}!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        
        setUserData({
          name: storedUsername || username,
          email: email
        });
      } else if (storedUsername || storedEmail) {
        setUserData({
          name: storedUsername || "User",
          email: storedEmail || "user@example.com"
        });
        if (storedUsername) {
          toast.success(`Welcome back, ${storedUsername}!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    }
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    navigate("/");
    setProfileOpen(false);
    toast.info("You have been logged out", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="dash-container">
      <ToastContainer />
      <div className="dash-container">
      {/* Header */}
      <header className="dash-header">
        <h1 className="dash-logo">LexiMind</h1>

        {/* Desktop Navigation */}
        <nav className="dash-desktop-nav">
          <ul className="dash-nav-list">
            <li><a href="#dash-hero" className="dash-nav-link">Home</a></li>
            <li><a href="#dash-how-it-works" className="dash-nav-link">How It Works</a></li>
            <li><a href="#dash-about" className="dash-nav-link">About Us</a></li>
            <li><a href="#dash-feedback" className="dash-nav-link">Feedback</a></li>
            <li className="dash-profile-container">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="dash-profile-button"
                aria-label="Profile menu"
              >
                <div className="dash-profile-avatar">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`} 
                    alt="Profile" 
                    className="dash-profile-image"
                  />
                  <span className="dash-profile-indicator"></span>
                </div>
              </button>
              {profileOpen && (
                <div className={`dash-profile-dropdown ${profileOpen ? 'dash-dropdown-open' : ''}`}>
                  <div className="dash-profile-info">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&size=128`} 
                      alt="Profile" 
                      className="dash-profile-large-image"
                    />
                    <p className="dash-profile-name">{userData.name}</p>
                    <p className="dash-profile-email">{userData.email}</p>
                  </div>
                  <div className="dash-profile-actions">
                    <Link to="/profile" className="dash-profile-action" onClick={() => setProfileOpen(false)}>
                      <User size={20} className="dash-action-icon" />
                      My Profile
                    </Link>
                    <button className="dash-profile-action" onClick={handleLogout}>
                      <LogOut size={20} className="dash-action-icon" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className="dash-mobile-nav">
          <div className="dash-profile-container">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="dash-profile-button"
              aria-label="Profile menu"
            >
              <div className="dash-profile-avatar">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`} 
                  alt="Profile" 
                  className="dash-profile-image"
                />
                <span className="dash-profile-indicator"></span>
              </div>
            </button>
            {profileOpen && (
              <div className={`dash-profile-dropdown ${profileOpen ? 'dash-dropdown-open' : ''}`}>
                <div className="dash-profile-info">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&size=128`} 
                    alt="Profile" 
                    className="dash-profile-large-image"
                  />
                  <p className="dash-profile-name">{userData.name}</p>
                  <p className="dash-profile-email">{userData.email}</p>
                </div>
                <div className="dash-profile-actions">
                  <Link to="/profile" className="dash-profile-action" onClick={() => setProfileOpen(false)}>
                    <User size={20} className="dash-action-icon" />
                    My Profile
                  </Link>
                  <button className="dash-profile-action" onClick={handleLogout}>
                    <LogOut size={20} className="dash-action-icon" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="dash-menu-button"
            aria-label="Mobile menu"
          >
            <span className={`dash-menu-icon ${menuOpen ? 'dash-menu-icon-open' : ''}`}></span>
            <span className={`dash-menu-icon ${menuOpen ? 'dash-menu-icon-open' : ''}`}></span>
            <span className={`dash-menu-icon ${menuOpen ? 'dash-menu-icon-open' : ''}`}></span>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className={`dash-mobile-menu ${menuOpen ? 'dash-menu-open' : ''}`}>
          <ul className="dash-mobile-menu-list">
            <li><a href="#dash-hero" className="dash-mobile-menu-link" onClick={closeMenu}>Home</a></li>
            <li><a href="#dash-how-it-works" className="dash-mobile-menu-link" onClick={closeMenu}>How It Works</a></li>
            <li><a href="#dash-about" className="dash-mobile-menu-link" onClick={closeMenu}>About Us</a></li>
            <li><a href="#dash-feedback" className="dash-mobile-menu-link" onClick={closeMenu}>Feedback</a></li>
            <li className="dash-profile-mobile-action">
              <Link to="/profile" className="dash-profile-action" onClick={closeMenu}>
                <User size={20} className="dash-action-icon" />
                My Profile
              </Link>
            </li>
            <li className="dash-profile-mobile-action">
              <button className="dash-profile-action" onClick={handleLogout}>
                <LogOut size={20} className="dash-action-icon" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Hero Section */}
      <section id="dash-hero" className="dash-hero">
        <div className="dash-hero-overlay">
          <h2 className="dash-hero-title">Summarize Legal Documents Instantly with Our Website</h2>
          <p className="dash-hero-text">Save time and get precise legal document summaries in seconds.</p>
          <button className="dash-hero-button dash-button-hover">Get Started</button>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="dash-how-it-works" className="dash-section">
        <h3 className="dash-section-title">How It Works</h3>
        <div className="dash-card-container">
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <Upload size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">Upload Document</h4>
            <p className="dash-card-text">Simply upload your legal document in PDF or DOCX format</p>
          </div>
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <FileText size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">AI Processing</h4>
            <p className="dash-card-text">Our advanced AI analyzes and summarizes your document</p>
          </div>
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <Download size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">Get Results</h4>
            <p className="dash-card-text">Download your concise summary in multiple formats</p>
          </div>
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <HelpCircle size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">Ask Questions</h4>
            <p className="dash-card-text">Interact with our AI to get specific answers about your document</p>
          </div>
        </div>
      </section>
      
      {/* About Us Section */}
      <section id="dash-about" className="dash-section">
        <h3 className="dash-section-title">About Us</h3>
        <div className="dash-card-container">
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <BookOpen size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">Our Mission</h4>
            <p className="dash-card-text">To revolutionize legal document analysis through AI-powered technology that saves time and enhances understanding for legal professionals and students alike.</p>
          </div>
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <Users size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">Who We Serve</h4>
            <p className="dash-card-text">Law firms, corporate legal departments, law students, and anyone who needs to quickly understand complex legal documents without compromising accuracy.</p>
          </div>
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <ShieldCheck size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">Accuracy & Security</h4>
            <p className="dash-card-text">Our AI ensures precise legal terminology retention while maintaining the highest standards of data confidentiality and security.</p>
          </div>
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <Lightbulb size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">Why Choose Us</h4>
            <p className="dash-card-text">Our specialized legal AI understands context, preserves key legal terminology, and provides insights that generic summarization tools can't match.</p>
          </div>
        </div>
      </section>
      
      {/* Feedback Section */}
      <section id="dash-feedback" className="dash-section">
        <h3 className="dash-section-title">Feedback</h3>
        <div className="dash-feedback-container">
          <div className="dash-feedback-icon-container">
            <MessageSquare size={60} className="dash-feedback-icon" />
          </div>
          <p className="dash-feedback-text">We value your feedback! Let us know how we can improve your experience with LexiMind.</p>
          <textarea 
            className="dash-feedback-input" 
            placeholder="Enter your feedback here..."
            rows="5"
          ></textarea>
          <button className="dash-feedback-button dash-button-hover">Submit Feedback</button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="dash-footer">
        <div className="dash-follow-us">
          <h3 className="dash-footer-title">Follow Us</h3>
          <div className="dash-social-cards">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="dash-social-card dash-facebook">
              <Facebook size={32} className="dash-social-icon" />
              <p>Facebook</p>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="dash-social-card dash-twitter">
              <Twitter size={32} className="dash-social-icon" />
              <p>Twitter</p>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="dash-social-card dash-instagram">
              <Instagram size={32} className="dash-social-icon" />
              <p>Instagram</p>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="dash-social-card dash-linkedin">
              <Linkedin size={32} className="dash-social-icon" />
              <p>LinkedIn</p>
            </a>
          </div>
        </div>
        <div className="dash-footer-bottom">
          <p className="dash-copyright">© {new Date().getFullYear()} LexiMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </div>
  );
}