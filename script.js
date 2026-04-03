/* ======================================================
   CLOUD FRANÇOIS — Interactions & Animations
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initTerminalTyping();
  initCounters();
  initMobileMenu();
});

/* ===================== NAVBAR SCROLL ===================== */

function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle('navbar--scrolled', currentScroll > 50);
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ===================== SCROLL ANIMATIONS ===================== */

function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ===================== TERMINAL TYPING ===================== */

function initTerminalTyping() {
  const cmdEl = document.getElementById('typed-cmd');
  const outputEl = document.getElementById('terminal-output');
  if (!cmdEl || !outputEl) return;

  const sequences = [
    {
      cmd: 'cloudfrancois deploy --region paris',
      output: [
        '<span class="info">▸ Building container image...</span>',
        '<span class="info">▸ Pushing to registry.cloudfrancois.fr...</span>',
        '<span class="info">▸ Deploying to paris-1...</span>',
        '<span class="highlight">✓ Deployed successfully in 4.2s</span>',
        '<span class="highlight">✓ https://mon-app.cloudfrancois.fr</span>',
      ]
    },
    {
      cmd: 'cloudfrancois status',
      output: [
        '<span class="info">  Service        Region    Status     Uptime</span>',
        '  api-backend    paris-1   <span class="highlight">● running</span>   99.99%',
        '  web-frontend   paris-2   <span class="highlight">● running</span>   99.99%',
        '  postgres-db    lyon-1    <span class="highlight">● running</span>   100.0%',
      ]
    },
    {
      cmd: 'cloudfrancois scale api-backend --replicas 5',
      output: [
        '<span class="info">▸ Scaling api-backend to 5 replicas...</span>',
        '<span class="info">▸ Replica 3/5 ready...</span>',
        '<span class="info">▸ Replica 5/5 ready...</span>',
        '<span class="highlight">✓ Scaled to 5 replicas across 2 AZs</span>',
      ]
    }
  ];

  let seqIndex = 0;

  async function typeSequence() {
    const seq = sequences[seqIndex % sequences.length];

    cmdEl.textContent = '';
    outputEl.innerHTML = '';

    for (let i = 0; i < seq.cmd.length; i++) {
      cmdEl.textContent += seq.cmd[i];
      await sleep(35 + Math.random() * 30);
    }

    await sleep(500);

    for (const line of seq.output) {
      const div = document.createElement('div');
      div.innerHTML = line;
      div.style.opacity = '0';
      div.style.transform = 'translateY(4px)';
      outputEl.appendChild(div);

      await sleep(80);
      div.style.transition = 'opacity 0.3s, transform 0.3s';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
      await sleep(300);
    }

    await sleep(3000);
    seqIndex++;
    typeSequence();
  }

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        typeSequence();
        heroObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  const terminal = document.querySelector('.hero__terminal');
  if (terminal) heroObserver.observe(terminal);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ===================== COUNTERS ===================== */

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isFloat = target !== Math.floor(target);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    if (isFloat) {
      el.textContent = prefix + current.toFixed(2) + suffix;
    } else if (target >= 1000) {
      el.textContent = prefix + Math.floor(current).toLocaleString('fr-FR') + suffix;
    } else {
      el.textContent = prefix + Math.floor(current) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ===================== MOBILE MENU ===================== */

function initMobileMenu() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      burger.classList.remove('active');
    });
  });
}
