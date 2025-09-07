import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../../assests/images/logo5.png';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const { isAuthenticated, user, logout, registerForTournament } = useAuth();

  // Handle register flow - let StatsUpload component handle the registration
  useEffect(() => {
    if (isAuthenticated && authMode === 'register') {
      console.log('User authenticated after register flow, StatsUpload will handle registration');
      // Reset auth mode - StatsUpload component will handle the rest
      setAuthMode('login');
    }
  }, [isAuthenticated, authMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsActive(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenStatsUpload = () => {
      console.log('Header.js - Received openStatsUpload event');
      // Open auth modal in register mode for tournament registration
      setAuthMode('register');
      setIsAuthModalOpen(true);
      document.body.classList.add('modal-open');
      console.log('Header.js - Auth modal opened in register mode');
    };

    const handleOpenAuthModal = (event) => {
      console.log('Header.js - Received openAuthModal event', event.detail);
      const mode = event.detail?.mode || 'register';
      setAuthMode(mode);
      setIsAuthModalOpen(true);
      document.body.classList.add('modal-open');
      console.log('Header.js - Auth modal opened in', mode, 'mode');
    };

    window.addEventListener('openStatsUpload', handleOpenStatsUpload);
    window.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => {
      window.removeEventListener('openStatsUpload', handleOpenStatsUpload);
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  const handleAuthClick = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    document.body.classList.add('modal-open');
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
    document.body.classList.remove('modal-open');
    // Dispatch auth complete event if user is authenticated
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

            {/* Authentication Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} initialMode={authMode} />
    </header>
  );
};

export default Header;