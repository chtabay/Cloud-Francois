/* ======================================================
   CLOUD FRANÇOIS — Interactions & Animations
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initTerminalTyping();
  initCounters();
  initMobileMenu();
  initLangToggle();
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

/* ===================== LANGUAGE TOGGLE ===================== */

const i18n = {
  fr: {
    'brand.name': 'Cloud <strong>François</strong>',
    'brand.tagline': 'L\'infrastructure cloud souveraine, sécurisée et performante, hébergée en France.',
    'brand.copy': '© 2026 Cloud François. Tous droits réservés.',
    'nav.services': 'Services',
    'nav.sovereignty': 'Souveraineté',
    'nav.infra': 'Infrastructure',
    'nav.pricing': 'Tarifs',
    'nav.contact': 'Contact',
    'nav.login': 'Se connecter',
    'nav.cta': 'Essai gratuit',
    'hero.badge': 'Disponible — Régions Paris, Lyon, Marseille',
    'hero.brand': 'Cloud <strong>François</strong>',
    'hero.title': 'Le Cloud <span class="gradient-text">Souverain.</span>',
    'hero.subtitle': 'Infrastructure souveraine, hébergée exclusivement en France. Vos données restent sur le sol national, conformes au RGPD, protégées des lois extraterritoriales.',
    'hero.cta1': 'Démarrer gratuitement',
    'hero.cta2': 'Découvrir nos services',
    'hero.deck': 'Voir le <strong>Pitch Deck investisseurs</strong>',
    'trust.secnum': 'SecNumCloud',
    'trust.secnum_sub': 'Qualifié ANSSI',
    'trust.rgpd': 'RGPD',
    'trust.rgpd_sub': '100% conforme',
    'trust.hds': 'HDS',
    'trust.hds_sub': 'Hébergeur de Données de Santé',
    'trust.iso': 'ISO 27001',
    'trust.iso_sub': 'Sécurité certifiée',
    'trust.sla': '99,99%',
    'trust.sla_sub': 'Disponibilité garantie',
    'svc.label': 'Services',
    'svc.title': 'Tout ce qu\'il faut pour construire,<br> déployer et scaler.',
    'svc.desc': 'Une gamme complète de services cloud, du calcul au stockage, du réseau à l\'IA, entièrement opérée depuis la France.',
    'svc.compute': 'Compute',
    'svc.compute_d': 'Instances virtuelles haute performance, bare metal, GPU. De 1 vCPU à des clusters de calcul massifs.',
    'svc.storage': 'Stockage Objet',
    'svc.storage_d': 'S3-compatible, répliqué sur trois datacenters français. Chiffrement AES-256 natif.',
    'svc.k8s': 'Kubernetes Managé',
    'svc.k8s_d': 'Clusters K8s certifiés CNCF, auto-scalables, avec intégration native de nos services.',
    'svc.network': 'Réseau Privé',
    'svc.network_d': 'vRack, Load Balancers, VPN IPSec, réseau 25 Gbps entre vos instances.',
    'svc.ai': 'IA & Machine Learning',
    'svc.ai_d': 'GPU NVIDIA H100, notebooks managés, MLOps intégré. Entraînez vos modèles en France.',
    'svc.db': 'Bases de Données',
    'svc.db_d': 'PostgreSQL, MySQL, Redis, MongoDB managés. Backups automatiques, réplication multi-AZ.',
    'svc.explore': 'Explorer →',
    'sov.label': 'Souveraineté',
    'sov.title': 'Vos données ne quittent <span class="gradient-text">jamais</span> la France.',
    'sov.desc': 'Dans un contexte géopolitique où les lois extraterritoriales (Cloud Act, FISA) menacent la confidentialité de vos données, Cloud François garantit une chaîne de confiance 100% française : capitaux, opérateurs, hébergement, droit applicable.',
    'sov.i1': 'Immunité au Cloud Act',
    'sov.i1d': 'Aucune entité américaine dans la chaîne capitalistique ni opérationnelle.',
    'sov.i2': 'Qualification SecNumCloud 3.2',
    'sov.i2d': 'Le plus haut niveau de sécurité exigé par l\'ANSSI pour les données sensibles.',
    'sov.i3': 'Droit français exclusif',
    'sov.i3d': 'Contrats, juridiction, et arbitrage sous droit français et européen uniquement.',
    'sov.i4': 'Réversibilité totale',
    'sov.i4d': 'Standards ouverts, API compatibles, aucun vendor lock-in. Vos données restent les vôtres.',
    'stats.label': 'Infrastructure',
    'stats.title': 'Bâti pour la performance <br>et la résilience.',
    'stats.dc': 'Datacenters en France',
    'stats.sla': 'SLA de disponibilité',
    'stats.energy': 'Énergie renouvelable',
    'stats.latency': 'Latence inter-régions',
    'stats.clients': 'Clients actifs',
    'stats.bw': 'Capacité réseau totale',
    'price.label': 'Tarifs',
    'price.title': 'Transparent, prévisible, sans surprise.',
    'price.desc': 'Pas de frais cachés, pas d\'egress fees abusifs. Un pricing clair à la française.',
    'price.t1': 'Découverte',
    'price.t1d': 'Pour démarrer et expérimenter.',
    'price.free': 'Gratuit',
    'price.forever': 'pour toujours',
    'price.start': 'Commencer',
    'price.popular': 'Le plus populaire',
    'price.t2': 'Professionnel',
    'price.t2d': 'Pour les équipes en production.',
    'price.from29': 'à partir de 29€',
    'price.monthly': '/ mois HT',
    'price.try': 'Essayer gratuitement',
    'price.t3': 'Souverain',
    'price.t3d': 'Pour les données sensibles et critiques.',
    'price.custom': 'Sur mesure',
    'price.annual': 'engagement annuel',
    'price.contact_us': 'Nous contacter',
    'cta.title': 'Prêt à reprendre le contrôle <br>de vos données ?',
    'cta.desc': 'Créez votre compte en 2 minutes. Aucune carte bancaire requise.',
    'cta.btn1': 'Créer mon compte',
    'cta.btn2': 'Demander une démo',
  },

  de: {
    'brand.name': 'Cloud <strong>Barbie</strong>',
    'brand.tagline': 'Die souveräne, sichere und leistungsstarke Cloud-Infrastruktur, gehostet in Europa.',
    'brand.copy': '© 2026 Cloud Barbie. Alle Rechte vorbehalten.',
    'nav.services': 'Dienste',
    'nav.sovereignty': 'Souveränität',
    'nav.infra': 'Infrastruktur',
    'nav.pricing': 'Preise',
    'nav.contact': 'Kontakt',
    'nav.login': 'Anmelden',
    'nav.cta': 'Kostenlos testen',
    'hero.badge': 'Bald verfügbar — Regionen Frankfurt & München',
    'hero.brand': 'Cloud <strong>Barbie</strong>',
    'hero.title': 'Die <span class="gradient-text">Souveräne</span> Cloud.',
    'hero.subtitle': 'Souveräne Infrastruktur, ausschließlich in Europa gehostet. Ihre Daten bleiben auf europäischem Boden, DSGVO-konform, geschützt vor extraterritorialen Gesetzen.',
    'hero.cta1': 'Frühzugang sichern',
    'hero.cta2': 'Unsere Dienste entdecken',
    'hero.deck': 'Zum <strong>Investor Pitch Deck</strong>',
    'trust.secnum': 'SecNumCloud',
    'trust.secnum_sub': 'ANSSI-zertifiziert',
    'trust.rgpd': 'DSGVO',
    'trust.rgpd_sub': '100% konform',
    'trust.hds': 'HDS',
    'trust.hds_sub': 'Hosting für Gesundheitsdaten',
    'trust.iso': 'ISO 27001',
    'trust.iso_sub': 'Zertifizierte Sicherheit',
    'trust.sla': '99,99%',
    'trust.sla_sub': 'Garantierte Verfügbarkeit',
    'svc.label': 'Dienste',
    'svc.title': 'Alles, was Sie brauchen zum Bauen,<br> Deployen und Skalieren.',
    'svc.desc': 'Ein vollständiges Cloud-Angebot — von Compute über Storage bis KI — vollständig aus Europa betrieben.',
    'svc.compute': 'Compute',
    'svc.compute_d': 'Hochleistungs-VMs, Bare Metal, GPU. Von 1 vCPU bis zu massiven Compute-Clustern.',
    'svc.storage': 'Object Storage',
    'svc.storage_d': 'S3-kompatibel, repliziert über drei europäische Rechenzentren. Native AES-256-Verschlüsselung.',
    'svc.k8s': 'Managed Kubernetes',
    'svc.k8s_d': 'CNCF-zertifizierte K8s-Cluster, auto-skalierbar, mit nativer Integration unserer Dienste.',
    'svc.network': 'Privates Netzwerk',
    'svc.network_d': 'vRack, Load Balancer, VPN IPSec, 25 Gbps Netzwerk zwischen Ihren Instanzen.',
    'svc.ai': 'KI & Machine Learning',
    'svc.ai_d': 'NVIDIA H100 GPUs, Managed Notebooks, integriertes MLOps. Trainieren Sie Ihre Modelle in Europa.',
    'svc.db': 'Datenbanken',
    'svc.db_d': 'Managed PostgreSQL, MySQL, Redis, MongoDB. Automatische Backups, Multi-AZ-Replikation.',
    'svc.explore': 'Entdecken →',
    'sov.label': 'Souveränität',
    'sov.title': 'Ihre Daten verlassen <span class="gradient-text">niemals</span> Europa.',
    'sov.desc': 'In einem geopolitischen Umfeld, in dem extraterritoriale Gesetze (Cloud Act, FISA) die Vertraulichkeit Ihrer Daten bedrohen, garantiert Cloud Barbie eine 100% europäische Vertrauenskette: Kapital, Betreiber, Hosting, anwendbares Recht.',
    'sov.i1': 'Immunität gegen den Cloud Act',
    'sov.i1d': 'Kein US-Unternehmen in der Kapital- oder Betriebskette.',
    'sov.i2': 'SecNumCloud 3.2 Qualifizierung',
    'sov.i2d': 'Das höchste von der ANSSI geforderte Sicherheitsniveau für sensible Daten.',
    'sov.i3': 'Ausschließlich europäisches Recht',
    'sov.i3d': 'Verträge, Gerichtsbarkeit und Schlichtung ausschließlich nach europäischem Recht.',
    'sov.i4': 'Vollständige Reversibilität',
    'sov.i4d': 'Offene Standards, kompatible APIs, kein Vendor Lock-in. Ihre Daten gehören Ihnen.',
    'stats.label': 'Infrastruktur',
    'stats.title': 'Gebaut für Leistung <br>und Resilienz.',
    'stats.dc': 'Rechenzentren in Europa',
    'stats.sla': 'Verfügbarkeits-SLA',
    'stats.energy': 'Erneuerbare Energie',
    'stats.latency': 'Latenz zwischen Regionen',
    'stats.clients': 'Aktive Kunden',
    'stats.bw': 'Gesamte Netzwerkkapazität',
    'price.label': 'Preise',
    'price.title': 'Transparent, planbar, ohne Überraschungen.',
    'price.desc': 'Keine versteckten Gebühren, keine überhöhten Egress-Kosten. Klare Preise, europäischer Stil.',
    'price.t1': 'Entdecken',
    'price.t1d': 'Zum Starten und Experimentieren.',
    'price.free': 'Kostenlos',
    'price.forever': 'für immer',
    'price.start': 'Loslegen',
    'price.popular': 'Am beliebtesten',
    'price.t2': 'Professionell',
    'price.t2d': 'Für Teams in Produktion.',
    'price.from29': 'ab 29€',
    'price.monthly': '/ Monat zzgl. MwSt.',
    'price.try': 'Kostenlos testen',
    'price.t3': 'Souverän',
    'price.t3d': 'Für sensible und kritische Daten.',
    'price.custom': 'Individuell',
    'price.annual': 'Jahresvertrag',
    'price.contact_us': 'Kontakt aufnehmen',
    'cta.title': 'Bereit, die Kontrolle über <br>Ihre Daten zurückzugewinnen?',
    'cta.desc': 'Erstellen Sie Ihr Konto in 2 Minuten. Keine Kreditkarte erforderlich.',
    'cta.btn1': 'Konto erstellen',
    'cta.btn2': 'Demo anfordern',
  }
};

let currentLang = 'fr';

function initLangToggle() {
  const toggle = document.getElementById('lang-toggle');
  if (!toggle) return;

  toggle.querySelectorAll('.lang-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      setLang(lang);
    });
  });
}

function setLang(lang) {
  currentLang = lang;
  const dict = i18n[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll('.lang-toggle__btn').forEach(btn => {
    btn.classList.toggle('lang-toggle__btn--active', btn.dataset.lang === lang);
  });

  document.body.classList.toggle('lang-de', lang === 'de');
  document.documentElement.lang = lang === 'de' ? 'de' : 'fr';
}
