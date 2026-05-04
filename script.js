// Startup Bio Site - Interactive Features
document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => mainNav.classList.toggle('show'));

  // Smooth scrolling
  document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        mainNav.classList.remove('show');
      }
    });
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') body.classList.add('light');
  themeToggle.textContent = body.classList.contains('light') ? '🌙' : '☀️';
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '🌙' : '☀️';
  });

// Animate stats counters
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const increment = target / 200;
      let current = 0;
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.floor(current) + (target > 100 ? 'K' : '%');
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + (target > 100 ? 'K' : '%');
        }
      };
      updateCounter();
    });
  }

  // Stats observer
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  });
  const statsSection = document.getElementById('stats');
  if (statsSection) statsObserver.observe(statsSection);

  // Testimonial slider
  let currentTestimonial = 0;
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  function showTestimonial(index) {
    testimonials.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentTestimonial);
    });
    nextBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    });
  }

  // Auto slide testimonials
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 5000);

  // Newsletter handler
  const newsletterBtn = document.querySelector('.newsletter-btn');
  const newsletterInput = document.querySelector('.newsletter-input');
  if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener('click', () => {
      const email = newsletterInput.value.trim();
      if (email) {
        localStorage.setItem('newsletter', email);
        alert('Subscribed! Check your email for updates.');
        newsletterInput.value = '';
      }
    });
  }

  // Dynamic projects loader
  const projectsGrid = document.getElementById('projectsGrid');
  fetch('projects.json')
    .then(res => res.json())
    .then(data => {
      data.projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
          <h4>${project.title}</h4>
          <p class="muted">${project.tags.join(' • ')}</p>
          <p>${project.description}</p>
          <div style="margin-top:1rem;">
            <a href="${project.url}" target="_blank" rel="noopener" class="btn-outline btn-small">Live Demo</a>
            ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="btn-outline btn-small" style="margin-left:0.5rem;">Source</a>` : ''}
          </div>
        `;
        projectsGrid.appendChild(card);
      });
    })

    .catch(err => {
      console.warn('Projects JSON not loaded, using fallback');
      projectsGrid.innerHTML = `
        <div class="project-card">
          <h4>Toko Online Complete</h4>
          <p class="muted">PHP • MySQL • Ecommerce</p>
          <p>Sistem toko lengkap dengan cart, checkout, admin panel.</p>
          <a href="../ecommerce/" target="_blank" class="btn-outline btn-small">Live Demo</a>
        </div>
        <div class="project-card">
          <h4>Sistem Absensi Digital</h4>
          <p class="muted">PHP • QR Code • Dashboard</p>
          <p>Absensi sekolah modern dengan QR dan reporting realtime.</p>
          <a href="../absensi_project_full_v2/" target="_blank" class="btn-outline btn-small">Live Demo</a>
        </div>
        <div class="project-card">
          <h4>Pisang Goreng Website</h4>
          <p class="muted">HTML • CSS • JS</p>
          <p>Website produk makanan dengan ordering system.</p>
          <a href="../POS_Pisang_Goreng_Ceisya_Rasa_PREMIUM_FINAL/" target="_blank" class="btn-outline btn-small">Live Demo</a>
        </div>
      `;
    });

  // Contact form handler
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Save locally
    const submissions = JSON.parse(localStorage.getItem('bioSiteSubmissions') || '[]');
    submissions.push({ ...data, submittedAt: new Date().toLocaleString('id-ID') });
    localStorage.setItem('bioSiteSubmissions', JSON.stringify(submissions));
    
    // Visual feedback
    const btn = form.querySelector('button[type=\"submit\"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> Mengirim...';
    btn.disabled = true;
    
    // Simulate send & WA redirect
    setTimeout(() => {
      btn.innerHTML = '<i class=\"fas fa-check\"></i> Terkirim!';
      btn.style.background = '#10b981';
      
      const waMessage = `Halo Raden!%0A%0ANama: ${data.name}%0AContact: ${data.contact}%0AProject: ${data.message.substring(0,100)}...`;
      if (confirm('Pesan tersimpan lokal. Buka WA untuk kirim langsung?')) {
        window.open(`https://wa.me/6281249366349?text=${waMessage}`, '_blank');
      }
      
      setTimeout(() => {
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }, 1500);
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Scroll animations
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.animationDelay = `${index * 0.1}s`;
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .project-card, .social-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    observer.observe(el);
  });

  // Parallax hero effect
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  });

  // PWA ready (basic)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {}); // Optional enhancement
  }
});

