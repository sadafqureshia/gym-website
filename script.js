'use strict';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Navigation menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navUl = document.querySelector('nav ul');

  menuToggle.addEventListener('click', () => {
    navUl.classList.toggle('show');
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      navUl.classList.remove('show');
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Sticky header
  const header = document.querySelector('header');
  const headerHeight = header.offsetHeight;

  window.addEventListener('scroll', () => {
    if (window.scrollY > headerHeight) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Parallax effect for hero section
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
  });

  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.facility-item, .service-item, .plan-item');
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);

  // Form submission with validation
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send the form data to a server
      // For demonstration, we'll just show a success message
      showNotification('Thank you for your message! We will get back to you soon.', 'success');
      contactForm.reset();
    }
  });

  function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;

    if (name.value.trim() === '') {
      showError(name, 'Name is required');
      isValid = false;
    } else {
      removeError(name);
    }

    if (email.value.trim() === '') {
      showError(email, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email');
      isValid = false;
    } else {
      removeError(email);
    }

    if (message.value.trim() === '') {
      showError(message, 'Message is required');
      isValid = false;
    } else {
      removeError(message);
    }

    return isValid;
  }

  function showError(input, message) {
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector('.error-message') || document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    if (!formControl.querySelector('.error-message')) {
      formControl.appendChild(errorElement);
    }
    input.classList.add('error');
  }

  function removeError(input) {
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector('.error-message');
    if (errorElement) {
      formControl.removeChild(errorElement);
    }
    input.classList.remove('error');
  }

  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Countdown timer for a special offer
  const countdownTimer = () => {
    const offerEnd = new Date("2023-12-31T23:59:59").getTime();
    const timer = document.createElement('div');
    timer.id = 'countdown-timer';
    timer.className = 'countdown-timer';
    document.body.appendChild(timer);

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = offerEnd - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timer.innerHTML = `
        <h3>Special Offer Ends In:</h3>
        <div class="countdown-values">
          <span>${days}d</span>
          <span>${hours}h</span>
          <span>${minutes}m</span>
          <span>${seconds}s</span>
        </div>
      `;

      if (distance < 0) {
        clearInterval(interval);
        timer.innerHTML = "<h3>Offer has ended!</h3>";
        setTimeout(() => {
          document.body.removeChild(timer);
        }, 5000);
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();
  };

  countdownTimer();

  // Image lazy loading
  const lazyImages = document.querySelectorAll('img[data-src]');
  const lazyLoadOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px 200px 0px"
  };

  const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, lazyLoadOptions);

  lazyImages.forEach(img => lazyLoadObserver.observe(img));

  // Testimonial slider
  const testimonials = [
    { name: "John Doe", text: "FitLife Gym has transformed my life. The trainers are amazing!" },
    { name: "Jane Smith", text: "I've never felt stronger or more confident. Thank you, FitLife!" },
    { name: "Mike Johnson", text: "The facilities are top-notch and the community is so supportive." }
  ];

  const testimonialContainer = document.querySelector('.testimonial-container');
  let currentTestimonial = 0;

  function showTestimonial() {
    const { name, text } = testimonials[currentTestimonial];
    testimonialContainer.innerHTML = `
      <blockquote>${text}</blockquote>
      <cite>- ${name}</cite>
    `;
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  }

  setInterval(showTestimonial, 5000);
  showTestimonial();

  // BMI Calculator
  const bmiForm = document.getElementById('bmi-form');
  const bmiResult = document.getElementById('bmi-result');

  bmiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (height && weight) {
      const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
      let category;

      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';

      bmiResult.innerHTML = `Your BMI is <strong>${bmi}</strong>. Category: <strong>${category}</strong>`;
    } else {
      bmiResult.innerHTML = 'Please enter valid height and weight.';
    }
  });

  // Newsletter subscription
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    if (isValidEmail(email)) {
      // Here you would typically send the email to your server
      showNotification('Thank you for subscribing to our newsletter!', 'success');
      newsletterForm.reset();
    } else {
      showNotification('Please enter a valid email address.', 'error');
    }
  });
});