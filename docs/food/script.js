/**
 * Community Outreach Page - Specific Scripts
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
        
        // Debug log (remove in production)
        console.log(`Slide changed to: ${currentSlide + 1}, Background: bg-${currentSlide + 1}`);
      }
      
      // Change slide every 4 seconds
      setInterval(changeSlide, 4000);
    }
    
    // ========== Scroll Animation for Elements ==========
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const triggerPoint = windowHeight * 0.85;
      return rect.top <= triggerPoint && rect.bottom >= 0;
    }
    
    function checkScrollAnimations() {
      animatedElements.forEach(function(el) {
        if (isElementInViewport(el)) {
          el.classList.add('visible');
        }
      });
    }
    
    window.addEventListener('scroll', checkScrollAnimations);
    window.addEventListener('load', checkScrollAnimations);
    
    // ========== Mobile Menu Toggle ==========
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      });
      
      // Close menu when clicking a link
      navMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
    
    // ========== Navbar Scroll Effect ==========
    const navbar = document.getElementById('navbar');
    
    function handleNavbarScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();
    
    // ========== Smooth Scroll for Anchor Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  });
})();
/**
 * Community Outreach Page - Specific Scripts
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