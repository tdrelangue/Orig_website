/**
 * Minimal JavaScript for form validation and accessibility enhancements
 * Total size: ~2KB minified
 */

(function() {
  'use strict';

  // Form validation and submission handling
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', function(event) {
      // Basic client-side validation
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      let isValid = true;
      let firstInvalidField = null;

      // Clear any previous error messages
      clearErrors();

      // Validate name
      if (name.value.trim() === '') {
        showError(name, 'Name is required');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = name;
      }

      // Validate email
      if (email.value.trim() === '') {
        showError(email, 'Email is required');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = email;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = email;
      }

      // Validate message
      if (message.value.trim() === '') {
        showError(message, 'Message is required');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = message;
      }

      // If validation fails, prevent submission and focus first invalid field
      if (!isValid) {
        event.preventDefault();
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      }
    });

    // Real-time validation feedback (optional enhancement)
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(function(input) {
      input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
          showError(this, this.previousElementSibling.textContent + ' is required');
        } else if (this.type === 'email' && !isValidEmail(this.value)) {
          showError(this, 'Please enter a valid email address');
        } else {
          clearError(this);
        }
      });

      input.addEventListener('input', function() {
        if (this.getAttribute('aria-invalid') === 'true') {
          clearError(this);
        }
      });
    });
  }

  /**
   * Email validation
   */
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Show error message for a field
   */
  function showError(field, message) {
    field.setAttribute('aria-invalid', 'true');

    let errorId = field.id + '-error';
    let errorElement = document.getElementById(errorId);

    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.id = errorId;
      errorElement.className = 'error-message';
      errorElement.setAttribute('role', 'alert');
      errorElement.style.cssText = 'display: block; color: #C53030; font-size: 0.875rem; margin-top: 0.25rem;';
      field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
    field.setAttribute('aria-describedby', errorId);
    field.style.borderColor = '#C53030';
  }

  /**
   * Clear error message for a field
   */
  function clearError(field) {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    field.style.borderColor = '';

    const errorId = field.id + '-error';
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Clear all error messages
   */
  function clearErrors() {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
      clearError(input);
    });
  }

  // Smooth scroll with reduced motion support
  document.addEventListener('DOMContentLoaded', function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const navLinks = document.querySelectorAll('nav a[href^="#"]');
      navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Set focus to the target section for keyboard users
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
          }
        });
      });
    }
  });

})();
