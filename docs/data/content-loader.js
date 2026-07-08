(function () {
  'use strict';

  var SITE_DATA_URL = 'data/pages.json';

  function getPageKey() {
    var path = window.location.pathname;
    if (path.indexOf('food/') !== -1) return 'food';
    if (path.indexOf('education-support') !== -1 || path.indexOf('education/') !== -1) return 'education';
    if (path.indexOf('community_outreach/') !== -1) return 'outreach';
    return 'home';
  }

  function imgPath(p) {
    var page = getPageKey();
    if (page === 'home') return p;
    return '../' + p;
  }

  function applyContent(data) {
    var page = getPageKey();
    var content = data[page];
    if (!content) return;

    if (content.heroSlides) {
      var slides = document.querySelectorAll('.text-slide');
      slides.forEach(function (el, i) {
        if (content.heroSlides[i]) el.textContent = content.heroSlides[i];
      });
    }

    if (content.heroSubtext) {
      var el = document.querySelector('.hero-subtext, .page-subtitle');
      if (el) el.textContent = content.heroSubtext;
    }

    if (content.aboutHeading) {
      var el = document.getElementById('about-heading');
      if (el) el.textContent = content.aboutHeading;
    }

    if (content.socialWorkHeading) {
      var el = document.getElementById('social-work-heading');
      if (el) el.textContent = content.socialWorkHeading;
    }

    if (content.contactHeading) {
      var el = document.getElementById('contact-heading');
      if (el) el.textContent = content.contactHeading;
    }

    if (content.galleryHeading) {
      var el = document.getElementById('gallery-heading');
      if (el) el.textContent = content.galleryHeading;
    }

    if (content.section1Heading) {
      var el = document.getElementById('section1-heading');
      if (el) el.textContent = content.section1Heading;
    }

    if (content.section1Text1) {
      var el = document.getElementById('section1-text1');
      if (el) el.textContent = content.section1Text1;
    }

    if (content.section1Text2) {
      var el = document.getElementById('section1-text2');
      if (el) el.textContent = content.section1Text2;
    }

    if (content.section2Heading) {
      var el = document.getElementById('section2-heading');
      if (el) el.textContent = content.section2Heading;
    }

    if (content.section2Text1) {
      var el = document.getElementById('section2-text1');
      if (el) el.textContent = content.section2Text1;
    }

    if (content.section2Text2) {
      var el = document.getElementById('section2-text2');
      if (el) el.textContent = content.section2Text2;
    }

    if (content.section1Image) {
      var el = document.getElementById('section1-image');
      if (el) el.style.backgroundImage = "url('" + imgPath(content.section1Image) + "')";
    }

    if (content.section2Image) {
      var el = document.getElementById('section2-image');
      if (el) el.style.backgroundImage = "url('" + imgPath(content.section2Image) + "')";
    }

    if (content.gallery) {
      var items = document.querySelectorAll('.gallery-placeholder');
      items.forEach(function (el, i) {
        if (content.gallery[i]) {
          el.style.backgroundImage = "url('" + imgPath(content.gallery[i]) + "')";
        }
      });
    }

    if (content.footerText) {
      var el = document.getElementById('footer-text');
      if (el) el.textContent = content.footerText;
    }

    if (content.aboutText) {
      var el = document.getElementById('about-text');
      if (el) el.innerHTML = content.aboutText;
    }

    if (content.foodCard) {
      var el = document.getElementById('food-card-heading');
      if (el) el.textContent = content.foodCard.heading;
      var textEl = document.getElementById('food-card-text');
      if (textEl) textEl.textContent = content.foodCard.text;
    }

    if (content.educationCard) {
      var el = document.getElementById('education-card-heading');
      if (el) el.textContent = content.educationCard.heading;
      var textEl = document.getElementById('education-card-text');
      if (textEl) textEl.textContent = content.educationCard.text;
    }

    if (content.outreachCard) {
      var el = document.getElementById('outreach-card-heading');
      if (el) el.textContent = content.outreachCard.heading;
      var textEl = document.getElementById('outreach-card-text');
      if (textEl) textEl.textContent = content.outreachCard.text;
    }
  }

  fetch(SITE_DATA_URL)
    .then(function (r) { return r.json(); })
    .then(applyContent)
    .catch(function () { });
})();
