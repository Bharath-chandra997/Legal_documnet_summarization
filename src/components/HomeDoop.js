import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, FileText, Download, MessageSquare, HelpCircle, BookOpen, Users, ShieldCheck, Lightbulb } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import "./HomeDoop.css";
export default function HomeDoop() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-[#a67c52] shadow-md py-3 px-6 flex justify-between items-center fixed w-full top-0 z-50">
  <h1 className="text-xl font-bold text-white">LExiMinD</h1>

  {/* Desktop Navigation */}
  <nav className="nav-menu">
    <ul className="flex space-x-6 items-center">
      <li><a href="#HeroSection" className="nav-link">Home</a></li>
      <li><a href="#how-it-works" className="nav-link">How It Works</a></li>
      <li><a href="#AboutUs" className="nav-link">About Us</a></li>
      <li><a href="#Feedback" className="nav-link">Feedback</a></li>
      <li>
        <Link to="/signin" state={{ isSignIn: true }} className="signin-button">
          Sign In
        </Link>
      </li>
      <li>
        <Link to="/signup" state={{ isSignIn: false }} className="register-button">
          Register
        </Link>
      </li>
    </ul>
  </nav>

  {/* Mobile Menu */}
  <div className="mobile-menu">
    <Link to="/signin" state={{ isSignIn: true }} className="signin-button">
      Sign In
    </Link>
    <Link to="/signup" state={{ isSignIn: false }} className="register-button">
      Register
    </Link>
    <button onClick={() => setMenuOpen(!menuOpen)} className="dropdown-button">
      Drop Down
    </button>
  </div>
</header>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="dropdown-menu open">
          <ul className="flex flex-col">
            <li><a href="#HeroSection" className="dropdown-link" onClick={closeMenu}>Home</a></li>
            <li><a href="#how-it-works" className="dropdown-link" onClick={closeMenu}>How It Works</a></li>
            <li><a href="#AboutUs" className="dropdown-link" onClick={closeMenu}>About Us</a></li>
            <li><a href="#Feedback" className="dropdown-link" onClick={closeMenu}>Feedback</a></li>
          </ul>
        </div>
      )}
      <section id="HeroSection" className="hero-section">
        <div className="hero-overlay">
          <h2 className="hero-title">Summarize Legal Documents Instantly with Our Website</h2>
          <p className="hero-text">Save time and get precise legal document summaries in seconds.</p>
          <button className="hero-button">GO</button>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section">
        <h3 className="section-title">How It Works</h3>
        <div className="card-container">
          <div className="card">
            <Upload size={40} className="card-icon" />
            <p>1. Upload your document</p>
          </div>
          <div className="card">
            <FileText size={40} className="card-icon" />
            <p>2. AI processes & summarizes</p>
          </div>
          <div className="card">
            <Download size={40} className="card-icon" />
            <p>3. Download the summary</p>
          </div>
          <div className="card">
            <HelpCircle size={40} className="card-icon" />
            <p>4. Ask Questions & Get Answers</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="AboutUs" className="section">
        <h3 className="section-title">About Us</h3>
        <div className="card-container">
          <div className="card">
            <BookOpen size={40} className="card-icon" />
            <h4>Mission</h4>
            <p>We aim to simplify legal documents using AI-powered summarization, helping students and lawyers save time.</p>
          </div>
          <div className="card">
            <Users size={40} className="card-icon" />
            <h4>Who We Serve</h4>
            <p>Designed for law students, legal professionals, and researchers needing quick access to legal insights.</p>
          </div>
          <div className="card">
            <ShieldCheck size={40} className="card-icon" />
            <h4>Accuracy & Security</h4>
            <p>Our AI ensures precise legal terminology retention, maintaining data confidentiality.</p>
          </div>
          <div className="card">
            <Lightbulb size={40} className="card-icon" />
            <h4>Why Choose Us?</h4>
            <p>Our tool is built specifically for the legal domain, offering contextual and legally accurate summaries.</p>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="Feedback" className="section">
        <h3 className="section-title">Feedback</h3>
        <div className="feedback-container">
          <MessageSquare size={40} className="feedback-icon" />
          <p className="feedback-text">We value your feedback! Let us know how we can improve.</p>
          <textarea className="feedback-input" placeholder="Enter your feedback here..."></textarea>
          <button className="feedback-button">Submit Feedback</button>
        </div>
      </section>

      {/* Footer */}
    
      <footer className="footer">
  <div className="follow-us">
    <h3 className="footer-title">Follow Us</h3>
    <div className="social-cards">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-card facebook">
        <Facebook size={40} className="social-icon" />
        <p>Facebook</p>
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-card twitter">
        <Twitter size={40} className="social-icon" />
        <p>Twitter</p>
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-card instagram">
        <Instagram size={40} className="social-icon" />
        <p>Instagram</p>
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-card linkedin">
        <Linkedin size={40} className="social-icon" />
        <p>LinkedIn</p>
      </a>
    </div>
  </div>
  
</footer>
    </div>
  );
}
