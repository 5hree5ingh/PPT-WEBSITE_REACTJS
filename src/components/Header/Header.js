import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../../assests/images/logo5.png';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';

// Header component that contains navigation and authentication controls
const Header = () => {
  // State variables for header functionality
  const [isActive, setIsActive] = useState(false);           // Header scroll state
  const [isNavOpen, setIsNavOpen] = useState(false);         // Mobile navigation state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Auth modal visibility
  const [authMode, setAuthMode] = useState('login');         // Auth modal mode (login/signup/register)

  // Get authentication state and functions from context
  const { isAuthenticated, user, logout, registerForTournament } = useAuth();

  // EFFECT 1: Handle register flow completion
  useEffect(() => {
    if (isAuthenticated && authMode === 'register') {
      console.log('User authenticated after register flow, StatsUpload will handle registration');
      // Reset auth mode - StatsUpload component will handle the rest
      setAuthMode('login');
    }
  }, [isAuthenticated, authMode]);

  // EFFECT 2: Handle header scroll state for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsActive(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // EFFECT 3: Listen for custom events to open auth modal
  useEffect(() => {
    // Handle openStatsUpload event (from Hero component register button)
    const handleOpenStatsUpload = () => {
      console.log('Header.js - Received openStatsUpload event');
      // Open auth modal in register mode for tournament registration
      setAuthMode('register');
      setIsAuthModalOpen(true);
      document.body.classList.add('modal-open');
      console.log('Header.js - Auth modal opened in register mode');
    };

    // Handle openAuthModal event (from StatsUpload component)
    const handleOpenAuthModal = (event) => {
      console.log('Header.js - Received openAuthModal event', event.detail);
      const mode = event.detail?.mode || 'register';
      setAuthMode(mode);
      setIsAuthModalOpen(true);
      document.body.classList.add('modal-open');
      console.log('Header.js - Auth modal opened in', mode, 'mode');
    };

    // Add event listeners
    window.addEventListener('openStatsUpload', handleOpenStatsUpload);
    window.addEventListener('openAuthModal', handleOpenAuthModal);
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('openStatsUpload', handleOpenStatsUpload);
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  // NAVIGATION HANDLERS
  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  // AUTHENTICATION HANDLERS
  // Handle clicking Sign Up/Login buttons in header
  const handleAuthClick = (mode = 'login') => {
    setAuthMode(mode);                    // Set auth mode (login/signup)
    setIsAuthModalOpen(true);             // Open auth modal
    document.body.classList.add('modal-open'); // Prevent body scroll
  };

  // Handle closing auth modal
  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
    document.body.classList.remove('modal-open');
    // Dispatch auth complete event if user is authenticated and in register mode
    if (isAuthenticated && authMode === 'register') {
      const event = new CustomEvent('authComplete', { 
        detail: { mode: authMode } 
      });
      window.dispatchEvent(event);
    }
    // Reset auth mode after modal closes
    if (authMode === 'register') {
      setAuthMode('login');
    }
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
    setIsNavOpen(false);
  };

  return (
    <header className={`header ${isActive ? 'active' : ''}`}>
      <div className="container">
        <a href="/" className="logo">
          <img 
            src={logo} 
            width="110" 
            height="53" 
            alt="unigine home" 
          />
        </a>
        
        <nav className={`navbar ${isNavOpen ? 'active' : ''}`}>
          <ul className="navbar-list">
            <li className="navbar-item">
              <a href="/" className="navbar-link" onClick={handleNavClose}>
                home
              </a>
            </li>
            <li className="navbar-item">
              <a href="/tournament" className="navbar-link" onClick={handleNavClose}>
                tournament
              </a>
            </li>
            <li className="navbar-item">
              <a href="#news" className="navbar-link" onClick={handleNavClose}>
                news
              </a>
            </li>
            <li className="navbar-item">
              <a href="/contact" className="navbar-link" onClick={handleNavClose}>
                contact
              </a>
            </li>
          </ul>
        </nav>
        
        {isAuthenticated ? (
          <div className="user-menu">
            <span className="user-email">{user?.email}</span>
            <button 
              onClick={handleLogout} 
              className="btn auth-btn-desktop logout-btn"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button 
              onClick={() => handleAuthClick('login')} 
              className="btn auth-btn-desktop login-btn"
            >
              Login
            </button>
            <button 
              onClick={() => handleAuthClick('signup')} 
              className="btn auth-btn-desktop signup-btn"
            >
              Sign Up
            </button>
          </div>
        )}
        
        {/* Mobile controls container */}
        <div className="mobile-controls">
          {isAuthenticated ? (
            <div className="mobile-user-menu">
              <span className="mobile-user-email">{user?.email}</span>
              <button 
                onClick={handleLogout} 
                className="profile-icon auth-btn-mobile logout-btn"
                title="Logout"
              >
                <ion-icon name="log-out-outline"></ion-icon>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleAuthClick('login')} 
              className="profile-icon auth-btn-mobile"
              title="Sign Up / Sign In"
            >
              <ion-icon name="person-circle-outline"></ion-icon>
            </button>
          )}
          
          <button 
            className={`nav-toggle-btn ${isNavOpen ? 'active' : ''}`}
            onClick={handleNavToggle}
            aria-label="toggle menu"
          >
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </button>
        </div>
      </div>

            {/* Authentication Modal - Pass authMode as initialMode */}
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} initialMode={authMode} />
    </header>
  );
};

export default Header;