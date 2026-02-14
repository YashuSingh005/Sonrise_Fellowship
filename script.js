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
          alert('Failed to send message.');
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

  // ========== Slider ==========
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderDotsEl = document.getElementById('sliderDots');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const slides = document.querySelectorAll('.slide');

  if (sliderTrack && slides.length) {
    let currentIndex = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      sliderTrack.style.transform = 'translateX(-' + currentIndex * 100 + '%)';
      sliderDotsEl.querySelectorAll('.slider-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () { goToSlide(i); });
      sliderDotsEl.appendChild(dot);
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentIndex + 1); });

    let touchStartX = 0;
    let touchEndX = 0;
    sliderTrack.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    sliderTrack.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      }
    }, { passive: true });
  }
})();
