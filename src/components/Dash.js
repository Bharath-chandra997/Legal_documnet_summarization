import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload, FileText, Download, MessageSquare,
  HelpCircle, BookOpen, Users, ShieldCheck,
  Lightbulb, Facebook, Twitter, Instagram,
  Linkedin, User, LogOut, Notebook
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Dash.css";
import axios from 'axios';

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(window.atob(base64));
    return decodedToken;
  } catch (error) {
    return null;
  }
};

export default function Dash() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [userData, setUserData] = useState({
    name: "User",
    email: "user@example.com",
  });
  const [hasNewBlog, setHasNewBlog] = useState(false);
  const navigate = useNavigate();

  const getImageSrc = (size = "") => {
    const storedImage = localStorage.getItem("image");
    if (storedImage) {
      try {
        new URL(storedImage);
        return storedImage;
      } catch (e) {
      }
    }

    const name = localStorage.getItem("username") || "User";
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}${size}&background=random`;
    return fallbackUrl;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const urlEmail = urlParams.get("email");
    const urlImage = urlParams.get("image");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      localStorage.setItem("email", urlEmail || "");
      if (urlImage) {
        localStorage.setItem("image", urlImage);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (token || urlToken) {
      const decodedToken = decodeJWT(token || urlToken);
      if (decodedToken) {
        const username = decodedToken.username || decodedToken.name || "User";
        const email = decodedToken.email || urlEmail || "user@example.com";
        const image = decodedToken.image || urlImage;

        if (image) {
          localStorage.setItem("image", image);
        }

        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        setUserData({
          name: username,
          email,
        });
      }
    }

    const checkNewBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/blog-posts', {
          params: { limit: 1, sort: '-createdAt' }
        });
        const latestPost = response.data[0];
        const lastVisited = localStorage.getItem('lastBlogVisit');
        
        if (latestPost && (!lastVisited || new Date(latestPost.createdAt) > new Date(lastVisited))) {
          setHasNewBlog(true);
        }
      } catch (error) {
      }
    };

    checkNewBlogs();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setProfileOpen(false);
    toast.info("You have been logged out", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        'http://localhost:8080/api/feedback',
        { content: feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Feedback submitted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFeedback('');
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="dash-container">
      <ToastContainer />
      <header className="dash-header">
        <h1 className="dash-logo">LExiMinD</h1>
        <nav className="dash-desktop-nav">
          <ul className="dash-nav-list">
            <li><a href="#dash-hero" className="dash-nav-link">Home</a></li>
            <li><a href="#dash-how-it-works" className="dash-nav-link">How It Works</a></li>
            <li><a href="#dash-about" className="dash-nav-link">About Us</a></li>
            <li className="dash-nav-item">
              <Link to="/blog" className="dash-nav-link">
                Blog
                {hasNewBlog && <span className="dash-notification-dot"></span>}
              </Link>
            </li>
            <li><a href="#dash-feedback" className="dash-nav-link">Feedback</a></li>
            <li className="dash-profile-container">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="dash-profile-button"
                aria-label="Profile menu"
              >
                <div className="dash-profile-avatar">
                  <img
                    src={getImageSrc()}
                    alt="Profile"
                    className="dash-profile-image"
                    onError={(e) => {
                      const name = localStorage.getItem("username") || "User";
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        name
                      )}&background=random`;
                    }}
                  />
                  <span className="dash-profile-indicator"></span>
                </div>
              </button>
              {profileOpen && (
                <div className={`dash-profile-dropdown ${profileOpen ? 'dash-dropdown-open' : ''}`}>
                  <div className="dash-profile-info">
                    <img
                      src={getImageSrc('&size=128')}
                      alt="Profile"
                      className="dash-profile-large-image"
                      onError={(e) => {
                        const name = localStorage.getItem("username") || "User";
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          name
                        )}&background=random&size=128`;
                      }}
                    />
                    <p className="dash-profile-name">{userData.name}</p>
                    <p className="dash-profile-email">{userData.email}</p>
                  </div>
                  <div className="dash-profile-actions">
                    <Link to="/ProfileWeb" className="dash-profile-action" onClick={() => setProfileOpen(false)}>
                      <User size={20} className="dash-action-icon" />
                      My Profile
                    </Link>
                    <Link to="/NotesApp" className="dash-profile-action" onClick={() => setProfileOpen(false)}>
                      <Notebook size={20} className="dash-action-icon" />
                      My Notes
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
        <div className="dash-mobile-nav">
          <div className="dash-profile-container">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="dash-profile-button"
              aria-label="Profile menu"
            >
              <div className="dash-profile-avatar">
                <img
                  src={getImageSrc()}
                  alt="Profile"
                  className="dash-profile-image"
                  onError={(e) => {
                    const name = localStorage.getItem("username") || "User";
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      name
                    )}&background=random`;
                  }}
                />
                <span className="dash-profile-indicator"></span>
              </div>
            </button>
            {profileOpen && (
              <div className={`dash-profile-dropdown ${profileOpen ? 'dash-dropdown-open' : ''}`}>
                <div className="dash-profile-info">
                  <img
                    src={getImageSrc('&size=128')}
                    alt="Profile"
                    className="dash-profile-large-image"
                    onError={(e) => {
                      const name = localStorage.getItem("username") || "User";
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        name
                      )}&background=random&size=128`;
                    }}
                  />
                  <p className="dash-profile-name">{userData.name}</p>
                  <p className="dash-profile-email">{userData.email}</p>
                </div>
                <div className="dash-profile-actions">
                  <Link to="/ProfileWeb" className="dash-profile-action" onClick={() => setProfileOpen(false)}>
                    <User size={20} className="dash-action-icon" />
                    My Profile
                  </Link>
                  <Link to="/NotesApp" className="dash-profile-action" onClick={() => setProfileOpen(false)}>
                    <Notebook size={20} className="dash-action-icon" />
                    My Notes
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
      {menuOpen && (
        <div className={`dash-mobile-menu ${menuOpen ? 'dash-menu-open' : ''}`}>
          <ul className="dash-mobile-menu-list">
            <li><a href="#dash-hero" className="dash-mobile-menu-link" onClick={closeMenu}>Home</a></li>
            <li><a href="#dash-how-it-works" className="dash-mobile-menu-link" onClick={closeMenu}>How It Works</a></li>
            <li><a href="#dash-about" className="dash-mobile-menu-link" onClick={closeMenu}>About Us</a></li>
            <li className="dash-nav-item">
              <Link to="/blog" className="dash-mobile-menu-link" onClick={closeMenu}>
                Blog
                {hasNewBlog && <span className="dash-notification-dot"></span>}
              </Link>
            </li>
            <li><a href="#dash-feedback" className="dash-mobile-menu-link" onClick={closeMenu}>Feedback</a></li>
          </ul>
        </div>
      )}
      <section id="dash-hero" className="dash-hero">
        <div className="dash-hero-overlay">
          <h1 className="dash-welcome-title">Welcome to LexiMind</h1>
          <h2 className="dash-hero-title">Summarize Legal Documents Instantly with Our Website</h2>
          <p className="dash-hero-text">Save time and get precise legal document summaries in seconds.</p>
          <button className="dash-hero-button dash-button-hover"
            onClick={() => navigate("/ModelsPage")}>Get Started</button>
        </div>
      </section>
      <section id="dash-how-it-works" className="dash-section">
        <h3 className="dash-section-title">How It Works</h3>
        <div className="dash-card-container">
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <Upload size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">Upload Document</h4>
            <p className="dash-card-text">Simply upload your legal document in any format</p>
          </div>
          <div className="dash-card dash-card-animate">
            <div className="dash-card-icon-container">
              <FileText size={48} className="dash-card-icon" />
            </div>
            <h4 className="dash-card-title">AI Processing</h4>
            <p className="dash-card-text">Our advanced AI analyzes and summarizes your document to streamline your workflow</p>
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
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button 
            className="dash-feedback-button dash-button-hover"
            onClick={handleFeedbackSubmit}
          >
            Submit Feedback
          </button>
        </div>
      </section>
      <footer className="dash-footer">
        <div className="dash-follow-us">
          <h3 className="dash-footer-title">Follow Us</h3>
          <div className="dash-social-cards">
            <a href="https://www.facebook.com/profile.php?id=61575305309035" target="_blank" rel="noopener noreferrer" className="dash-social-card dash-facebook">
              <Facebook size={32} className="dash-social-icon" />
              <p>Facebook</p>
            </a>
            <a href="https://x.com/Leximind_off" target="_blank" rel="noopener noreferrer" className="dash-social-card dash-twitter">
              <Twitter size={32} className="dash-social-icon" />
              <p>Twitter</p>
            </a>
            <a href="https://www.instagram.com/leximind_official?igsh=c3lnODBjeXlhazlw" target="_blank" rel="noopener noreferrer" className="dash-social-card dash-instagram">
              <Instagram size={32} className="dash-social-icon" />
              <p>Instagram</p>
            </a>
            <a href="https://www.linkedin.com/in/leximind1/" target="_blank" rel="noopener noreferrer" className="dash-social-card dash-linkedin">
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
  );
}