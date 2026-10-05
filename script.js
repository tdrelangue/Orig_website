/**
 * OrigAI - Language Toggle & Form Validation
 * Lightweight, accessible, eco-responsible
 * Target: < 3KB minified (no scroll-jacking, no console output)
 */

(function() {
  'use strict';

  var STORAGE_KEY = 'orig_lang';
  var DEFAULT_LANG = 'fr';

  // =========================
  // Language Toggle
  // =========================

  /**
   * Initialize language from URL, localStorage, or default
   */
  function initLanguage() {
    var lang = DEFAULT_LANG;

    // Check URL parameter first (?lang=en or ?lang=fr)
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var urlLang = urlParams.get('lang');
      if (urlLang === 'fr' || urlLang === 'en') {
        lang = urlLang;
      } else {
        // Check localStorage
        var storedLang = localStorage.getItem(STORAGE_KEY);
        if (storedLang === 'fr' || storedLang === 'en') {
          lang = storedLang;
        }
      }
    } catch (e) {
      // URLSearchParams or localStorage not available
    }

    setLanguage(lang);
  }

  /**
   * Set the active language
   */
  function setLanguage(lang) {
    // Update HTML lang attribute and data-lang attribute
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    // Update page title - reads per-page data attributes if present
    var titleFr = document.documentElement.getAttribute('data-title-fr')
      || 'OrigAI';
    var titleEn = document.documentElement.getAttribute('data-title-en')
      || 'OrigAI';
    document.title = lang === 'en' ? titleEn : titleFr;

    // Toggle visibility of all language content
    var allLangElements = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < allLangElements.length; i++) {
      var el = allLangElements[i];
      if (el.getAttribute('data-lang') === lang) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', '');
      }
    }

    // Update radio button state for both desktop and mobile groups
    var radios = document.querySelectorAll('input[name="language-desktop"], input[name="language-mobile"]');
    for (var j = 0; j < radios.length; j++) {
      radios[j].checked = radios[j].value === lang;
    }

    // Translate aria-labels and <option> texts that cannot hold two spans
    var labelled = document.querySelectorAll('[data-label-en]');
    for (var k = 0; k < labelled.length; k++) {
      labelled[k].setAttribute('aria-label', labelled[k].getAttribute('data-label-' + lang));
    }
    // Text-only elements carry their English text in data-en (fewer DOM nodes)
    var texts = document.querySelectorAll('[data-en]');
    for (var m = 0; m < texts.length; m++) {
      if (!texts[m].hasAttribute('data-fr')) {
        texts[m].setAttribute('data-fr', texts[m].textContent);
      }
      texts[m].textContent = texts[m].getAttribute('data-' + lang);
    }

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Handle language toggle change
   */
  function handleLanguageChange(e) {
    var newLang = e.target.value;
    if (newLang === 'fr' || newLang === 'en') {
      setLanguage(newLang);
    }
  }

  /**
   * Setup language toggle listeners
   */
  function setupLanguageToggle() {
    var radios = document.querySelectorAll('input[name="language-desktop"], input[name="language-mobile"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', handleLanguageChange);
    }
  }

  // =========================
  // Form Validation
  // =========================

  /**
   * Email validation
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Show error for a field
   */
  function showError(field, msg) {
    field.setAttribute('aria-invalid', 'true');
    field.style.borderColor = '#C53030';

    var errorId = field.id + '-error';
    var errorEl = document.getElementById(errorId);

    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.id = errorId;
      errorEl.className = 'field-error';
      errorEl.setAttribute('role', 'alert');
      errorEl.style.cssText = 'display:block;color:#C53030;font-size:0.875rem;margin-top:0.25rem;';
      field.parentNode.appendChild(errorEl);
    }

    errorEl.textContent = msg;
    field.setAttribute('aria-describedby', errorId);
  }

  /**
   * Clear error for a field
   */
  function clearError(field) {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    field.style.borderColor = '';

    var errorEl = document.getElementById(field.id + '-error');
    if (errorEl) {
      errorEl.parentNode.removeChild(errorEl);
    }
  }

  /**
   * Clear all form errors
   */
  function clearAllErrors(form) {
    var fields = form.querySelectorAll('input, textarea');
    for (var i = 0; i < fields.length; i++) {
      clearError(fields[i]);
    }
  }

  /**
   * Get error message based on language
   */
  function getErrorMsg(key) {
    var lang = document.documentElement.lang;
    var msgs = {
      nameRequired: lang === 'en' ? 'Name is required' : 'Nom est requis',
      emailRequired: lang === 'en' ? 'Email is required' : 'Email est requis',
      emailInvalid: lang === 'en' ? 'Please enter a valid email' : 'Veuillez entrer un email valide',
      messageRequired: lang === 'en' ? 'Message is required' : 'Message est requis'
    };
    return msgs[key] || '';
  }

  /**
   * Setup form validation
   */
  function setupFormValidation() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      var nameField = document.getElementById('name');
      var emailField = document.getElementById('email');
      var messageField = document.getElementById('message');

      var isValid = true;
      var firstInvalid = null;

      clearAllErrors(form);

      // Validate name
      if (nameField && nameField.value.trim() === '') {
        showError(nameField, getErrorMsg('nameRequired'));
        isValid = false;
        if (!firstInvalid) firstInvalid = nameField;
      }

      // Validate email
      if (emailField) {
        if (emailField.value.trim() === '') {
          showError(emailField, getErrorMsg('emailRequired'));
          isValid = false;
          if (!firstInvalid) firstInvalid = emailField;
        } else if (!isValidEmail(emailField.value)) {
          showError(emailField, getErrorMsg('emailInvalid'));
          isValid = false;
          if (!firstInvalid) firstInvalid = emailField;
        }
      }

      // Validate message
      if (messageField && messageField.value.trim() === '') {
        showError(messageField, getErrorMsg('messageRequired'));
        isValid = false;
        if (!firstInvalid) firstInvalid = messageField;
      }

      if (!isValid) {
        e.preventDefault();
        if (firstInvalid) firstInvalid.focus();
      }
    });

    // Real-time validation on blur
    var requiredFields = form.querySelectorAll('input[required], textarea[required]');
    for (var i = 0; i < requiredFields.length; i++) {
      (function(field) {
        field.addEventListener('blur', function() {
          if (field.value.trim() === '') {
            var labelText = field.id.charAt(0).toUpperCase() + field.id.slice(1);
            showError(field, getErrorMsg(field.id + 'Required') || labelText + ' is required');
          } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showError(field, getErrorMsg('emailInvalid'));
          } else {
            clearError(field);
          }
        });

        field.addEventListener('input', function() {
          if (field.getAttribute('aria-invalid') === 'true') {
            clearError(field);
          }
        });
      })(requiredFields[i]);
    }
  }

  // =========================
  // Smooth Scroll (optional)
  // =========================

  function setupSmoothScroll() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var navLinks = document.querySelectorAll('nav a[href^="#"]');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        var target = document.querySelector(targetId);

        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Move focus to target for keyboard users without re-scrolling
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    }
  }

  // =========================
  // Mobile Menu
  // =========================

  var mobileMenuBtn = null;
  var mobileMenu = null;
  var isMenuOpen = false;

  function openMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;
    isMenuOpen = true;
    mobileMenu.removeAttribute('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', handleMenuEscape);
  }

  function closeMobileMenu(returnFocus) {
    if (!mobileMenu || !mobileMenuBtn) return;
    isMenuOpen = false;
    mobileMenu.setAttribute('hidden', '');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', handleMenuEscape);
    if (returnFocus !== false) {
      mobileMenuBtn.focus();
    }
  }

  function toggleMobileMenu() {
    if (isMenuOpen) {
      closeMobileMenu(true);
    } else {
      openMobileMenu();
    }
  }

  function handleMenuEscape(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMobileMenu(true);
    }
  }

  function handleMenuLinkClick(e) {
    var target = e.target.closest('a[href^="#"]');
    if (target && isMenuOpen) {
      closeMobileMenu(false);
    }
  }

  function setupMobileMenu() {
    mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileMenu.addEventListener('click', handleMenuLinkClick);
  }

  // =========================
  // Scroll Effects (optional)
  // =========================

  /**
   * Enable optional scroll effects via ?effects=1 query param
   * Adds data-effects="on" to <html> for CSS sticky titles
   */
  function setupScrollEffects() {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('effects') === '1') {
        document.documentElement.setAttribute('data-effects', 'on');
      }
    } catch (e) {
      // URLSearchParams not available
    }
  }

  // =========================
  // Contact subject preselect (?sujet=produits)
  // =========================

  function preselectSubject() {
    var select = document.getElementById('subject');
    if (!select) return;
    try {
      var wanted = new URLSearchParams(window.location.search).get('sujet');
      if (wanted && select.querySelector('option[value="' + wanted.replace(/[^a-z]/g, '') + '"]')) {
        select.value = wanted;
      }
    } catch (e) {
      // URLSearchParams not available
    }
  }

  // =========================
  // Values bird (home hero): tap/Enter/Space pins a value, Escape dismisses (WCAG 1.4.13)
  // =========================

  function collapseFacets(except) {
    var facets = document.querySelectorAll('.facet[aria-expanded="true"]');
    for (var i = 0; i < facets.length; i++) {
      if (facets[i] !== except) facets[i].setAttribute('aria-expanded', 'false');
    }
  }

  function toggleFacet(facet) {
    var open = facet.getAttribute('aria-expanded') === 'true';
    collapseFacets(facet);
    facet.setAttribute('aria-expanded', open ? 'false' : 'true');
    facet.closest('.hero-art').removeAttribute('data-dismissed');
  }

  function handleFacetClick(e) {
    toggleFacet(e.currentTarget);
  }

  function handleFacetKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFacet(e.currentTarget);
    }
  }

  function handleFacetFocus(e) {
    collapseFacets(e.currentTarget);
  }

  function handleValuesEscape(e) {
    if (e.key !== 'Escape') return;
    var art = document.querySelector('.hero-art');
    if (!art) return;
    collapseFacets(null);
    art.setAttribute('data-dismissed', '');
  }

  function handleValuesOutside(e) {
    if (!e.target.closest('.hero-art')) collapseFacets(null);
  }

  function clearValuesDismissed(e) {
    e.currentTarget.removeAttribute('data-dismissed');
  }

  function setupValues() {
    var art = document.querySelector('.hero-art');
    if (!art) return;
    var facets = art.querySelectorAll('.facet');
    for (var i = 0; i < facets.length; i++) {
      facets[i].addEventListener('click', handleFacetClick);
      facets[i].addEventListener('keydown', handleFacetKey);
      facets[i].addEventListener('focus', handleFacetFocus);
      facets[i].addEventListener('mouseenter', handleFacetFocus);
    }
    art.addEventListener('mouseleave', clearValuesDismissed);
    art.addEventListener('focusin', clearValuesDismissed);
    document.addEventListener('keydown', handleValuesEscape);
    document.addEventListener('click', handleValuesOutside);
  }

  // =========================
  // Initialize
  // =========================

  function init() {
    initLanguage();
    setupLanguageToggle();
    setupFormValidation();
    setupSmoothScroll();
    setupMobileMenu();
    setupScrollEffects();
    preselectSubject();
    setupValues();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
