import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");
    
    const revealElementOnScroll = function () {
      for (let i = 0, len = revealElements.length; i < len; i++) {
        const isElementInsideWindow = revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.1;
        if (isElementInsideWindow) {
          revealElements[i].classList.add("revealed");
        }
      }
    };

    window.addEventListener("scroll", revealElementOnScroll);
    window.addEventListener("load", revealElementOnScroll);

    return () => {
      window.removeEventListener("scroll", revealElementOnScroll);
      window.removeEventListener("load", revealElementOnScroll);
    };
  }, []);
};