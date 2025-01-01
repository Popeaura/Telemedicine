document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  
    // Mobile menu toggle
    const navToggle = document.createElement('button');
    navToggle.classList.add('nav-toggle');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('nav').appendChild(navToggle);
  
    navToggle.addEventListener('click', () => {
      document.querySelector('.nav ul').classList.toggle('show');
    });
  
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imgOptions = {
      threshold: 0,
      rootMargin: "0px 0px 50px 0px"
    };
  
    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imgObserver.unobserve(img);
      });
    }, imgOptions);
  
    images.forEach(image => imgObserver.observe(image));
  
    // Simple form validation for appointment booking
    const appointmentForm = document.querySelector('form');
    if (appointmentForm) {
      appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        appointmentForm.querySelectorAll('input, select, textarea').forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        });
        if (isValid) {
          alert('Appointment request submitted successfully!');
          appointmentForm.reset();
        } else {
          alert('Please fill in all required fields.');
        }
      });
    }
  
    // Animation for statistics
    const statCards = document.querySelectorAll('.stat-card');
    const statOptions = {
      threshold: 0.5
    };
  
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, statOptions);
  
    statCards.forEach(card => statObserver.observe(card));
  });
  
  