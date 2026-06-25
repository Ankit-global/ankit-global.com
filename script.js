// ============================================================
//  ANKIT GLOBAL — Main Script
// ============================================================

// ---------- NAV SCROLL ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('scrollTopBtn').classList.toggle('visible', window.scrollY > 400);
});

// ---------- MOBILE NAV ----------
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMobile.classList.toggle('open');
});
document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMobile.classList.remove('open');
  });
});

// ---------- SMOOTH SCROLL (closes mobile nav too) ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 68;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ---------- SCROLL TO TOP ----------
document.getElementById('scrollTopBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- REVEAL ON SCROLL ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- COUNTER ANIMATION ----------
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ---------- PROJECT FILTER ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeUp 0.4s ease forwards';
      }
    });
  });
});

// ---------- EMAILJS CONFIG ----------
// Sign up free at https://www.emailjs.com, then fill in your IDs below
const EMAILJS_PUBLIC_KEY  = '6fHnL_Vg7_JlJlMSK';
const EMAILJS_SERVICE_ID  = 'service_zeb965d';
const EMAILJS_TEMPLATE_ID = 'template_r0a9wk4';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ---------- CONTACT FORM ----------
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn        = this.querySelector('button[type="submit"]');
  const successMsg = document.getElementById('formSuccess');

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const company = document.getElementById('company').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  btn.textContent = 'Sending...';
  btn.disabled = true;

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name:    name,
    from_email:   email,
    company:      company || 'Not provided',
    service:      service || 'Not specified',
    message:      message,
    to_email:     'support@ankit-global.com',
    reply_to:     email,
  })
  .then(() => {
    this.reset();
    btn.innerHTML = 'Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
    btn.disabled = false;
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 6000);
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    btn.textContent = 'Failed — try again';
    btn.disabled = false;
  });
});

// ---------- ACTIVE NAV LINK ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta-link)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// ============================================================
//  PARTICLE NETWORK CANVAS
// ============================================================
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = ['59,130,246', '139,92,246', '6,182,212'];
  const COUNT  = 90;
  const CONNECT_DIST = 160;
  const mouse  = { x: -9999, y: -9999 };
  let particles = [];

  // ---- Resize ----
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // ---- Particle class ----
  class Particle {
    constructor() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.8 + 0.8;
      this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.a  = Math.random() * 0.5 + 0.25;
      this.pulse  = Math.random() * Math.PI * 2;
      this.pSpeed = 0.018 + Math.random() * 0.015;
    }
    update() {
      this.pulse += this.pSpeed;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.hypot(dx, dy);
      if (d < 130 && d > 0) {
        this.x += (dx / d) * 2;
        this.y += (dy / d) * 2;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Wrap edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width)  this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    draw() {
      const pr = this.r + Math.sin(this.pulse) * 0.6;
      const pa = this.a + Math.sin(this.pulse) * 0.08;

      // Soft glow halo
      ctx.beginPath();
      ctx.arc(this.x, this.y, pr * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},0.04)`;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, pr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},${pa})`;
      ctx.fill();
    }
  }

  // ---- Draw connecting lines ----
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist > CONNECT_DIST) continue;

        const alpha = (1 - dist / CONNECT_DIST) * 0.22;
        const grad  = ctx.createLinearGradient(
          particles[i].x, particles[i].y,
          particles[j].x, particles[j].y
        );
        grad.addColorStop(0, `rgba(${particles[i].c},${alpha})`);
        grad.addColorStop(1, `rgba(${particles[j].c},${alpha})`);
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      }
    }
  }

  // ---- Animation loop ----
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  // ---- Init ----
  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
    animate();
  }

  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  });

  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  init();
})();
