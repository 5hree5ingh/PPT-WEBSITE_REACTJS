import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Footer.css';
import logo from '../../assests/images/logo5.png';

const Footer = () => {
  useScrollReveal();

  return (
    <footer className="footer">
      <div className="section footer-top">
        <div className="container">
          <div className="footer-brand">
            <a href="#home" className="logo">
              <img src={logo} width="150" height="73" loading="lazy" alt="logo" />
            </a>
            <p className="footer-text">
              Panchayat Point aims to unite gamers through thrilling Smashkarts tournaments and unique community-driven events.
              Our goal is to build India's biggest gaming hub where competition meets fun.
            </p>
            <ul className="social-list">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <ion-icon name="logo-facebook"></ion-icon>
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <ion-icon name="logo-twitter"></ion-icon>
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <ion-icon name="logo-instagram"></ion-icon>
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <ion-icon name="logo-youtube"></ion-icon>
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-list">
            <p className="title footer-list-title has-after">Useful Links</p>
            <ul>
              <li>
                <a href="#tournament" className="footer-link">Tournament</a>
              </li>
              <li>
                <a href="#help" className="footer-link">Help Center</a>
              </li>
              <li>
                <a href="#privacy" className="footer-link">Privacy and Policy</a>
              </li>
              <li>
                <a href="#terms" className="footer-link">Terms and Conditions</a>
              </li>
            </ul>
          </div>
          <div className="footer-list">
            <p className="title footer-list-title has-after">Contact Us</p>
            <div className="contact-item">
              <span className="span">Location</span>
              <address className="contact-link">245 C BLOCK, Sector 28, Panchkula, Haryana</address>
            </div>
            <div className="contact-item">
              <span className="span">Join Us</span>
              <a href="mailto:panchayatpointevent1@gmail.com" className="contact-link">panchayatpointevent1@gmail.com</a>
            </div>
            <div className="contact-item">
              <span className="span">Phone</span>
              <a href="tel:8766358288" className="contact-link">8763288</a>
            </div>
          </div>
          <div className="footer-list">
            <p className="title footer-list-title has-after">Newsletter Signup</p>
            <form action="./index.html" method="get" className="footer-form">
              <input type="email" name="email_address" required placeholder="Enter your email" autoComplete="off" className="input-field" />
              <button type="submit" className="btn" data-btn>Subscribe Now</button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; 2025 Panchayat Point Event. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;