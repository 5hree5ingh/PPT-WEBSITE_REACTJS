import React from 'react';
import './Hero.css';
import heroBanner from '../../assests/images/hero-banner1.png';
import heroBannerBg from '../../assests/images/hero-banner-bg.png';

const Hero = () => {
  return (
    <div className="hero has-before" id="home">
      <div className="container">
        <p className="section-subtitle">PPLS-6.0 is back</p>
        <h1 className="h1 title hero-title">Panchayat Point Premier League</h1>
        <a href="#contact" className="btn" data-btn>REGISTER</a>
        <div className="hero-banner">
          <img src={heroBanner} alt="hero banner" className="w-100" width="850" height="414" />
          <img src={heroBannerBg} alt="hero-banner-bg" className="hero-banner-bg" />
        </div>
      </div>
    </div>
  );
};

export default Hero;