import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../../assests/images/logo5.png';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsActive(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  return (
    <header className={`header ${isActive ? 'active' : ''}`}>
      <div className="container">
        <a href="#home" className="logo">
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
              <a href="#home" className="navbar-link" onClick={handleNavClose}>
                home
              </a>
            </li>
            <li className="navbar-item">
              <a href="#tournament" className="navbar-link" onClick={handleNavClose}>
                tournament
              </a>
            </li>
            <li className="navbar-item">
              <a href="#news" className="navbar-link" onClick={handleNavClose}>
                news
              </a>
            </li>
            <li className="navbar-item">
              <a href="#contact" className="navbar-link" onClick={handleNavClose}>
                contact
              </a>
            </li>
          </ul>
        </nav>
        
        <a href="#contact" className="btn">join our team</a>
        
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
    </header>
  );
};

export default Header;