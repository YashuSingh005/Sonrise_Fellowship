/**
 * Sonrise Ministry - Website Scripts
 * Handles form submission, mobile menu, scroll animations, and navbar
 */

(function () {
  'use strict';

  // ========== DOM Elements ==========
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.getElementById('navbar');

  // ========== Mobile Menu Toggle ==========
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link (smooth scroll then close)
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ========== Navbar Scroll Effect ==========
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();

  // ========== EmailJS Init & Contact Form Submit ==========
  if (typeof emailjs !== 'undefined') {
    emailjs.init('q-5DeiVSIk8f0Odxl');
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      emailjs.sendForm('service_b1jmi0b', 'template_crxa6ne', this)
        .then(function () {
          alert('Message sent successfully!');
          contactForm.reset();
        }, function (error) {
          console.error('EmailJS error:', error);
          alert('Failed to send message. Please try again later.');
        });
    });
  }

  // ========== Scroll Animations ==========
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const triggerPoint = windowHeight * 0.85;
    return rect.top <= triggerPoint && rect.bottom >= 0;
  }

  function checkScrollAnimations() {
    animatedElements.forEach(function (el) {
      if (isElementInViewport(el)) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkScrollAnimations);
  window.addEventListener('load', checkScrollAnimations);

  // ========== Background and Text Slider ==========
  const slideBackgrounds = document.querySelectorAll('.slide-bg');
  const textSlides = document.querySelectorAll('.text-slide');
  
  if (slideBackgrounds.length && textSlides.length) {
    let currentSlide = 0;
    const totalSlides = slideBackgrounds.length;
    
    function changeSlide() {
      // Remove active class from current slide
      slideBackgrounds[currentSlide].classList.remove('active');
      textSlides[currentSlide].classList.remove('active');
      
      // Move to next slide
      currentSlide = (currentSlide + 1) % totalSlides;
      
      // Add active class to new slide
      slideBackgrounds[currentSlide].classList.add('active');
      textSlides[currentSlide].classList.add('active');
      
      // Optional: Log slide change for debugging
      console.log('Slide changed to:', currentSlide + 1);
    }
    
    // Change slide every 10 seconds (10000 milliseconds)
    setInterval(changeSlide, 10000);
    
    // Add a small delay before starting the slider to ensure everything loads
    setTimeout(() => {
      console.log('Slider initialized - will change every 10 seconds');
    }, 1000);
  }

  // ========== Smooth Scroll for Anchor Links ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

  // ========== Parallax Effect on Mouse Move ==========
  const aboutSection = document.querySelector('.about');
  const socialWorkSection = document.querySelector('.social-work');
  
  if (aboutSection) {
    const bubbles = aboutSection.querySelectorAll('.parallax-bubble');
    
    aboutSection.addEventListener('mousemove', function(e) {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      bubbles.forEach((bubble, index) => {
        const speed = 20 + (index * 10);
        const x = (mouseX * speed);
        const y = (mouseY * speed);
        bubble.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
    
    aboutSection.addEventListener('mouseleave', function() {
      bubbles.forEach((bubble, index) => {
        bubble.style.transform = 'translate(0, 0)';
      });
    });
  }
  
  if (socialWorkSection) {
    const lines = socialWorkSection.querySelectorAll('.parallax-line');
    
    socialWorkSection.addEventListener('mousemove', function(e) {
      const mouseX = e.clientX / window.innerWidth;
      
      lines.forEach((line, index) => {
        const speed = 30 + (index * 15);
        const x = (mouseX * speed);
        line.style.transform = `translateX(${x}px) rotate(${index % 2 === 0 ? -2 : 3}deg)`;
      });
    });
    
    socialWorkSection.addEventListener('mouseleave', function() {
      lines.forEach((line, index) => {
        line.style.transform = `rotate(${index === 0 ? -2 : index === 1 ? 3 : -1}deg)`;
      });
    });
  }

  // ========== Preloader (optional) ==========
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add page transition class to main sections
    document.querySelectorAll('section').forEach(section => {
      section.classList.add('page-transition');
    });
  });

})();