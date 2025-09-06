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

  const { isAuthenticated, user, logout } = useAuth();

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
      // Open auth modal in stats upload mode
      setAuthMode('statsUpload');
      setIsAuthModalOpen(true);
      document.body.classList.add('modal-open');
      console.log('Header.js - Auth modal opened in statsUpload mode');
    };

    window.addEventListener('openStatsUpload', handleOpenStatsUpload);
    return () => window.removeEventListener('openStatsUpload', handleOpenStatsUpload);
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