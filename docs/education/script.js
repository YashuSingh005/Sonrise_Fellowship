/**
 * Education Support Page - Specific Scripts
 * Handles text slider with color-changing background
 */

(function() {
  'use strict';

  // ========== Text Slider with Color Changing Background ==========
  document.addEventListener('DOMContentLoaded', function() {
    const textSlides = document.querySelectorAll('.text-slide');
    const pageHeader = document.getElementById('dynamicHeader');
    
    if (textSlides.length && pageHeader) {
      let currentSlide = 0;
      const totalSlides = textSlides.length;
      
      // Set initial background class
      pageHeader.classList.add('bg-1');
      
      // Function to change slide and background
      function changeSlide() {
        // Remove active class from current slide
        textSlides[currentSlide].classList.remove('active');
        
        // Remove current background class
        pageHeader.classList.remove(`bg-${currentSlide + 1}`);
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // Add active class to new slide
        textSlides[currentSlide].classList.add('active');
        
        // Add new background class
        pageHeader.classList.add(`bg-${currentSlide + 1}`);
      }
      
      // Change slide every 4 seconds
      setInterval(changeSlide, 4000);
    }
  });
})();