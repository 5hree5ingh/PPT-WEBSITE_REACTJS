import React, { useState } from 'react';
import './AuthModal.css';
import StatsUpload from '../StatsUpload/StatsUpload';

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFormTransitioning, setIsFormTransitioning] = useState(false);
  const [showStatsUpload, setShowStatsUpload] = useState(false);
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);

  const handleSignInClick = () => {
    if (isSignUp) {
      setIsFormTransitioning(true);
      setTimeout(() => {
        setIsSignUp(false);
        setIsFormTransitioning(false);
      }, 200);
    }
  };

  const handleSignUpClick = () => {
    if (!isSignUp) {
      setIsFormTransitioning(true);
      setTimeout(() => {
        setIsSignUp(true);
        setIsFormTransitioning(false);
      }, 200);
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setShowStatsUpload(true);
  };

  const handleStatsUploadComplete = (stats) => {
    setShowPlayerProfile(true);
  };

  const handleCloseModal = () => {
    onClose();
    setShowStatsUpload(false);
    setShowPlayerProfile(false);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleCloseModal}>
      <div className={`auth-modal ${showPlayerProfile ? 'profile-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleCloseModal}>
          <ion-icon name="close-outline"></ion-icon>
        </button>
        
        {!showStatsUpload && !showPlayerProfile && (
          <div className="auth-tabs" data-active={isSignUp ? 'signup' : 'signin'}>
            <button 
              className={`auth-tab ${!isSignUp ? 'active' : ''}`}
              onClick={handleSignInClick}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${isSignUp ? 'active' : ''}`}
              onClick={handleSignUpClick}
            >
              Sign Up
            </button>
          </div>
        )}

        <div className={`auth-form-container ${isFormTransitioning ? 'transitioning' : ''}`}>
          {!isSignUp ? (
            <form className="auth-form">
              <div className="form-group">
                <input type="email" placeholder="Email" required className="auth-input" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Password" required className="auth-input" />
              </div>
              <button type="submit" className="auth-submit-btn">Sign In</button>
              
              <div className="auth-divider">
                <span>or</span>
              </div>
              
              <div className="social-auth-buttons">
                <button type="button" className="social-auth-btn google-btn" title="Sign in with Google">
                  <ion-icon name="logo-google"></ion-icon>
                </button>
                <button type="button" className="social-auth-btn discord-btn" title="Sign in with Discord">
                  <ion-icon name="logo-discord"></ion-icon>
                </button>
              </div>
              
              {/* Invisible spacers to match Sign Up form height */}
              <div style={{ height: '60px', opacity: 0, pointerEvents: 'none' }}></div>
              <div style={{ height: '60px', opacity: 0, pointerEvents: 'none' }}></div>
            </form>
          ) : showStatsUpload ? (
            <StatsUpload onClose={handleCloseModal} onProfileDisplayed={handleStatsUploadComplete} />
          ) : (
            <form className="auth-form" onSubmit={handleSignUpSubmit}>
              <div className="form-group">
                <input type="text" placeholder="Discord Username" required className="auth-input" />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email" required className="auth-input" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Password" required className="auth-input" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Confirm Password" required className="auth-input" />
              </div>
              <button type="submit" className="auth-submit-btn">Sign Up</button>
              
              <div className="auth-divider">
                <span>or</span>
              </div>
              
              <div className="social-auth-buttons">
                <button type="button" className="social-auth-btn google-btn" title="Sign up with Google">
                  <ion-icon name="logo-google"></ion-icon>
                </button>
                <button type="button" className="social-auth-btn discord-btn" title="Sign up with Discord">
                  <ion-icon name="logo-discord"></ion-icon>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
