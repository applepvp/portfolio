/* ============================================
   Portfolio Enzo Morelli — script.js
   ============================================ */

// ── Navbar ────────────────────────────────────
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
const links   = document.querySelectorAll('.nav-link');

// Scroll: add class to navbar
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
}, { passive: true });

// Burger menu
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  const spans = burger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close on link click
links.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// Active link on scroll
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop) current = sec.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

// ── Hero Canvas (Particle / Circuit Network) ──
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  // Adapted for light mode: softer red-orange tones
  const cfg = {
    count: 70,
    maxDist: 130,
    speed: 0.3,
    radius: 1.2,
    colorA: '220,50,30',   // red
    colorB: '255,107,53',  // orange
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticles() {
    particles = Array.from({ length: cfg.count }, () => ({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-cfg.speed, cfg.speed),
      vy: rand(-cfg.speed, cfg.speed),
      color: Math.random() > 0.5 ? cfg.colorA : cfg.colorB,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Move particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    // Draw connections — lighter opacity for light backgrounds
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.maxDist) {
          const alpha = (1 - dist / cfg.maxDist) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${particles[i].color},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, cfg.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},0.45)`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  resize();
  createParticles();
  draw();
})();

// ── Modals ────────────────────────────────────
const modalOverlays = document.querySelectorAll('.modal-overlay');
const modalBtns     = document.querySelectorAll('[data-modal]');

function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  const closeBtn = overlay.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeModal(overlay) {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalBtns.forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

modalOverlays.forEach(overlay => {
  overlay.querySelector('.modal-close')?.addEventListener('click', () => closeModal(overlay));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay);
  });
});

// ESC key closes modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modalOverlays.forEach(overlay => {
      if (overlay.classList.contains('active')) closeModal(overlay);
    });
  }
});

// ── Reveal on Scroll (IntersectionObserver) ───
(function initReveal() {
  const revealEls = document.querySelectorAll(
    '.section-header, .project-card, .skill-card, .softskill-item, .interest-card, .contact-card, .timeline-item, .contact-cta-card, .sport-card'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    const delay = (i % 4) * 100;
    el.style.transitionDelay = delay + 'ms';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

// ── Smooth counter animation for hero stats ───
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.textContent, 10);
      let current  = 0;
      const step   = Math.ceil(target / 30);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else el.textContent = current;
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

// ── Scroll Progress Bar ───────────────────────
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

// ── 3D Tilt on Project Cards ─────────────────
(function initTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -5;
      const rotY   = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease, border-color 0.3s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });
})();

// ── Carousel Boxe ─────────────────────────────
let currentSlide = 0;
function moveCarousel(dir) {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides || slides.length === 0) return;
  
  // Remove classes
  slides.forEach(slide => {
    slide.classList.remove('slide-active', 'slide-next', 'slide-prev');
  });
  
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  
  const nextSlide = (currentSlide + 1) % slides.length;
  const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
  
  slides[currentSlide].classList.add('slide-active');
  slides[nextSlide].classList.add('slide-next');
  slides[prevSlide].classList.add('slide-prev');
}

// ── Init ──────────────────────────────────────
updateActiveLink();
