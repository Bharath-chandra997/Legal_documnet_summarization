import React from 'react';
import './ModelsPage.css';
import { FiUpload, FiDownload, FiCheck, FiFile, FiBarChart2, FiZap, FiLink, FiClock, FiAward, FiShield, FiSearch, FiList } from 'react-icons/fi';
import { Link, useNavigate } from "react-router-dom";



const ModelsPage= () => {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h1>Free AI Article Summarizer</h1>
          <p>Transform lengthy articles into concise summaries with the power of AI in seconds.</p>
        </div>

        {/* Full-length Alternating Cards */}
        <div className="full-length-cards">
          
        <div className="full-card legal-card">
          <div className="card-image">
            <div className="image-placeholder">
              <img 
                src="https://i.postimg.cc/Gttf5nRJ/Chat-GPT-Image-Apr-4-2025-02-19-26-PM.png" 
                alt="Legal Document Summarization" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top'
                }}
              />
            </div>
          </div>
          <div className="card-content">
            <div className="card-header">
              <div className="animated-icon">
                <FiFile className="card-icon" />
              </div>
              <h2>Legal Document Summarization</h2>
            </div>
            {/* Add the "How It Works" section here */}
            <div className="how-it-works">
              <h3 className="how-it-works-title">How Legal Summarization Works:</h3>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Upload Legal Document</h4>
                    <p>Upload contracts, briefs, or case files in PDF, DOCX, or TXT format</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>AI Legal Analysis</h4>
                    <p>Our specialized legal AI identifies key clauses, parties, obligations, and terms</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Receive Structured Summary</h4>
                    <p>Get a clear summary providing essential legal points and critical dates </p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Need Clarification?</h4>
                    <p>Use our Q&A model to ask questions about any part of your document</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h4>Want to write a note?</h4>
                    <p>Add personal notes or comments directly to the summarized document for future reference</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h4>Want to Download Summary?</h4>
                    <p>Download your AI-generated legal summary as a TXT for easy storage and sharing</p>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>

          {/* Card 2: Transformer-based Legal Summarization - Image Right */}
          <div className="full-card generative-ai-card">
            <div className="card-image">
              <div className="image-placeholder generative-image">
                <img 
                  src="https://i.postimg.cc/6pfhn1J9/Chat-GPT-Image-Apr-4-2025-02-08-10-PM.png" 
                  alt="Transformer-based Legal Summarization" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
              </div>
            </div>
            <div className="card-content">
              <div className="card-header">
                <div className="animated-icon">
                  <FiZap className="card-icon" />
                </div>
                <h2>Transformer-based Legal Summarization</h2>
              </div>
              <p className="card-description">
                Our custom-built Transformer-based model streamlines legal comprehension by producing accurate, 
                human-like summaries of complex legal judgments. Trained on domain-specific data, it ensures 
                precision and consistency across documents.
              </p>
              
              <div className="card-features">
                <div className="feature">
                  <div className="feature-icon-wrapper">
                    <FiClock className="feature-icon" />
                  </div>
                  <span>Time-saving summaries for busy professionals</span>
                </div>
                <div className="feature">
                  <div className="feature-icon-wrapper">
                    <FiCheck className="feature-icon" />
                  </div>
                  <span>Accurate results with legal precision</span>
                </div>
                <div className="feature">
                  <div className="feature-icon-wrapper">
                    <FiZap className="feature-icon" />
                  </div>
                  <span>Fast results in seconds, not hours</span>
                </div>
                <div className="feature">
                  <div className="feature-icon-wrapper">
                    <FiFile className="feature-icon" />
                  </div>
                  <span>Domain-specific training for legal documents</span>
                </div>
              </div>
              
              <button className="primary-btn" onClick={() => navigate("/Summarization")}>
                <div className="btn-icon-wrapper">
                  <FiDownload className="btn-icon" />
                </div>
                Generate Legal Summary
              </button>
              
              <div className="card-stats">
                <div className="stat">
                  <div className="stat-icon-wrapper">
                    <FiAward className="stat-icon" />
                  </div>
                  <span>80% accuracy rate on legal judgments</span>
                </div>
                <div className="stat">
                  <div className="stat-icon-wrapper">
                    <FiShield className="stat-icon" />
                  </div>
                  <span>Confidential processing with no data retention</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: RAG-Powered Legal Search - Image Left */}
          <div className="full-card">
            <div className="card-image">
              <div className="image-placeholder insights-image">
                <img 
                  src="https://i.postimg.cc/DfQmvVqy/Chat-GPT-Image-Apr-4-2025-02-13-35-PM.png" 
                  alt="RAG-Powered Legal Search" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
              </div>
            </div>
            <div className="card-content">
              <div className="card-header">
                <div className="animated-icon">
                  <FiSearch className="card-icon" />
                </div>
                <h2>RAG-Powered Legal Search</h2>
              </div>
              <p className="card-description">
                Extract precise answers from PDFs through semantic search. 100% retrieval-based - no generated content, 
                just the most relevant document passages with full context and accuracy.
              </p>
              
              <div className="card-features">
                <div className="feature">
                  <div className="feature-icon-wrapper">
                    <FiZap className="feature-icon" />
                  </div>
                  <span>Fast retrieval of relevant legal passages</span>
                </div>
                <div className="feature">
                  <div className="feature-icon-wrapper">
                    <FiFile className="feature-icon" />
                  </div>
                  <span>Multi-document search across multiple files</span>
                </div>
                <div className="feature">
                  <div className="feature-icon-wrapper">
                    <FiCheck className="feature-icon" />
                  </div>
                  <span>Retrieves accurate context with source references</span>
                </div>
                <div className="feature">
                  <div className="feature-icon-wrapper">
                    <FiShield className="feature-icon" />
                  </div>
                  <span>Maintains document integrity with no hallucinations</span>
                </div>
              </div>
              
              <button className="primary-btn" onClick={() => navigate("/QAPage")}>
                <div className="btn-icon-wrapper">
                  <FiSearch className="btn-icon" />
                </div>
                Search Legal Documents
              </button>
              
              <div className="card-tags">
                <span className="tag">Case Law</span>
                <span className="tag">Contracts</span>
                <span className="tag">Statutes</span>
                <span className="tag">Legal Briefs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-model">
        <div className="footer-content">
          <div className="footer-section">
            <h1>AI Summarizer</h1>
            <p className="subtitle">Powered by custom trained Transformer</p>
          </div>
          
          <div className="footer-section">
            <h2>Features</h2>
            <ul>
              <li>Article Summarization</li>
              <li>Quick Q&A</li>
              <li>Smart Notes</li>
              <li>File Download</li>
              <li>Language Switch</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h2>Supported Formats</h2>
            <ul>
              <li>PDF Documents</li>
              <li>DOCX Files</li>
              <li>Text Files</li>
              <li>Scanned PDFs</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModelsPage;