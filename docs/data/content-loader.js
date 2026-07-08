(function () {
  'use strict';

  const SITE_DATA_URL = 'data/pages.json';

  function getPageKey() {
    const path = window.location.pathname;
    if (path.endsWith('food/index.html') || path.endsWith('food/')) return 'food';
    if (path.endsWith('education-support.html') || path.endsWith('education/')) return 'education';
    if (path.endsWith('community_outreach/index.html') || path.endsWith('community_outreach/')) return 'outreach';
    return 'home';
  }

  function applyContent(data) {
    const page = getPageKey();
    const content = data[page];
    if (!content) return;

    if (content.heroSlides) {
      const slides = document.querySelectorAll('.text-slide');
      slides.forEach((el, i) => {
        if (content.heroSlides[i]) el.textContent = content.heroSlides[i];
      });
    }

    if (content.heroSubtext) {
      const el = document.querySelector('.hero-subtext, .page-subtitle');
      if (el) el.textContent = content.heroSubtext;
    }

    if (content.aboutHeading) {
      const el = document.getElementById('about-heading');
      if (el) el.textContent = content.aboutHeading;
    }

    if (content.socialWorkHeading) {
      const el = document.getElementById('social-work-heading');
      if (el) el.textContent = content.socialWorkHeading;
    }

    if (content.contactHeading) {
      const el = document.getElementById('contact-heading');
      if (el) el.textContent = content.contactHeading;
    }

    if (content.galleryHeading) {
      const el = document.getElementById('gallery-heading');
      if (el) el.textContent = content.galleryHeading;
    }

    if (content.section1Heading) {
      const el = document.getElementById('section1-heading');
      if (el) el.textContent = content.section1Heading;
    }

    if (content.section1Text1) {
      const el = document.getElementById('section1-text1');
      if (el) el.textContent = content.section1Text1;
    }

    if (content.section1Text2) {
      const el = document.getElementById('section1-text2');
      if (el) el.textContent = content.section1Text2;
    }

    if (content.section2Heading) {
      const el = document.getElementById('section2-heading');
      if (el) el.textContent = content.section2Heading;
    }

    if (content.section2Text1) {
      const el = document.getElementById('section2-text1');
      if (el) el.textContent = content.section2Text1;
    }

    if (content.section2Text2) {
      const el = document.getElementById('section2-text2');
      if (el) el.textContent = content.section2Text2;
    }

    if (content.section1Image) {
      const el = document.getElementById('section1-image');
      if (el) el.style.backgroundImage = "url('" + content.section1Image + "')";
    }

    if (content.section2Image) {
      const el = document.getElementById('section2-image');
      if (el) el.style.backgroundImage = "url('" + content.section2Image + "')";
    }

    if (content.gallery) {
      const items = document.querySelectorAll('.gallery-placeholder');
      items.forEach((el, i) => {
        if (content.gallery[i]) {
          el.style.backgroundImage = "url('" + content.gallery[i] + "')";
        }
      });
    }

    if (content.footerText) {
      const el = document.getElementById('footer-text');
      if (el) el.textContent = content.footerText;
    }

    if (content.aboutText) {
      const el = document.getElementById('about-text');
      if (el) el.innerHTML = content.aboutText;
    }

    if (content.foodCard) {
      const el = document.getElementById('food-card-heading');
      if (el) el.textContent = content.foodCard.heading;
      const textEl = document.getElementById('food-card-text');
      if (textEl) textEl.textContent = content.foodCard.text;
    }

    if (content.educationCard) {
      const el = document.getElementById('education-card-heading');
      if (el) el.textContent = content.educationCard.heading;
      const textEl = document.getElementById('education-card-text');
      if (textEl) textEl.textContent = content.educationCard.text;
    }

    if (content.outreachCard) {
      const el = document.getElementById('outreach-card-heading');
      if (el) el.textContent = content.outreachCard.heading;
      const textEl = document.getElementById('outreach-card-text');
      if (textEl) textEl.textContent = content.outreachCard.text;
    }
  }

  fetch(SITE_DATA_URL)
    .then(function (r) { return r.json(); })
    .then(applyContent)
    .catch(function () { });
})();
