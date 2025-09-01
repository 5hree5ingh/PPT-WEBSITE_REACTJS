import React from 'react';
import { useBackToTop } from '../../hooks/userBackToTop';
import './BackToTop.css';

const BackToTop = () => {
  const { isVisible, scrollToTop } = useBackToTop();

  return (
    <a 
      href="#top" 
      className={`back-top-btn ${isVisible ? 'active' : ''}`} 
      aria-label="back to top" 
      data-back-top-btn
      onClick={(e) => {
        e.preventDefault();
        scrollToTop();
      }}
    >
      <ion-icon name="arrow-up-outline" aria-hidden="true"></ion-icon>
    </a>
  );
};

export default BackToTop;