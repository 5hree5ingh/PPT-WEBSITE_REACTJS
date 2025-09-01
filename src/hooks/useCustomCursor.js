import { useEffect } from 'react';

export const useCustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector("[data-cursor]");
    const hoverElements = [...document.querySelectorAll("a"), ...document.querySelectorAll("button")];

    const cursorMove = function (event) {
      cursor.style.top = `${event.clientY}px`;
      cursor.style.left = `${event.clientX}px`;
    };

    window.addEventListener("mousemove", cursorMove);

    const addHoverEffect = function () {
      cursor.classList.add("hovered");
    };

    const removeHoverEffect = function () {
      cursor.classList.remove("hovered");
    };

    hoverElements.forEach(element => {
      element.addEventListener("mouseover", addHoverEffect);
      element.addEventListener("mouseout", removeHoverEffect);
    });

    return () => {
      window.removeEventListener("mousemove", cursorMove);
      hoverElements.forEach(element => {
        element.removeEventListener("mouseover", addHoverEffect);
        element.removeEventListener("mouseout", removeHoverEffect);
      });
    };
  }, []);
};