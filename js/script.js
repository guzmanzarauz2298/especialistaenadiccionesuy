(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__list a'));

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinks.find(function (a) { return a.getAttribute('href') === '#' + entry.target.id; });
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ accordion ---------- */
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.accordion__trigger'));
  triggers.forEach(function (trigger) {
    var panel = trigger.parentElement.nextElementSibling;
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      triggers.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
        t.parentElement.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- WhatsApp click tracking (para remarketing) ----------
     Cuando instales Meta Pixel / Google Tag, estos eventos ya quedan
     disparándose en cada clic a WhatsApp, listos para armar audiencias. */
  var waLinks = Array.prototype.slice.call(document.querySelectorAll('[data-wa-track]'));
  waLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var source = link.getAttribute('data-wa-track') || 'unknown';

      if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        window.dataLayer.push({ event: 'whatsapp_click', click_source: source });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'WhatsAppClick', { source: source });
      }
    });
  });

  /* =========================================================
     CEREBRO INTERACTIVO DE PARTÍCULAS
     - El cerebro está formado por partículas doradas.
     - Al pasar el mouse / dedo, se "deshace" localmente.
     - Al hacer clic, explota y se vuelve a armar.
     - Suelta "ideas": puntos que suben y palabras que flotan.
     ========================================================= */
  var stage = document.getElementById('brainStage');
  var canvas = document.getElementById('brainCanvas');
  if (!stage || !canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var wordsLayer = document.getElementById('brainWords');
  var hint = document.getElementById('brainHint');
  var hintHidden = false;

  var WORDS = ['claridad', 'calma', 'recuperación', 'equilibrio', 'bienestar', 'propósito', 'vínculos', 'presencia', 'confianza'];
  var wordIndex = 0;

  /* --- Forma del cerebro (vista lateral), viewBox 400x340 --- */
  var VIEW_W = 400, VIEW_H = 340;
  var OUTLINE = 'M60,190 C55,150 75,110 110,95 C120,60 165,45 195,60 C215,35 265,35 285,60 C320,55 345,85 340,115 C365,130 370,170 350,195 C355,225 330,250 300,250 C285,275 245,285 220,270 C200,290 160,290 145,265 C110,270 80,245 82,215 C65,210 60,200 60,190 Z';
  var FOLDS = [
    'M120,110 C150,100 170,115 175,140',
    'M200,70 C195,100 210,120 235,118',
    'M280,75 C270,100 285,120 310,125',
    'M110,170 C140,160 160,175 165,205',
    'M200,150 C230,140 250,160 245,190',
    'M300,160 C285,180 295,205 315,205',
    'M150,220 C180,215 200,230 205,255',
    'M295,252 C308,262 302,282 283,286 C268,289 252,281 250,268',
    'M272,286 L280,312'
  ];

  var COLORS = [
    'rgba(201,161,90,',   // dorado
    'rgba(224,190,126,',  // dorado claro
    'rgba(237,232,220,',  // marfil
    'rgba(111,160,143,'   // verde salvia
  ];

  var particles = [];
  var ideas = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var cw = 0, ch = 0;          // tamaño CSS del canvas
  var scale = 1, offX = 0, offY = 0;
  var mouse = { x: -9999, y: -9999, active: false };
  var running = false;
  var sampled = null;          // puntos base en coords del viewBox

  function samplePoints() {
    var off = document.createElement('canvas');
    off.width = VIEW_W * 2;
    off.height = VIEW_H * 2;
    var octx = off.getContext('2d');
    octx.scale(2, 2);
    octx.strokeStyle = '#fff';
    octx.lineWidth = 5;
    octx.stroke(new Path2D(OUTLINE));
    octx.lineWidth = 4;
    FOLDS.forEach(function (d) { octx.stroke(new Path2D(d)); });

    var data = octx.getImageData(0, 0, off.width, off.height).data;
    var pts = [];
    var step = 7; // densidad de muestreo
    for (var y = 0; y < off.height; y += step) {
      for (var x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 128) {
          pts.push({ x: x / 2, y: y / 2 });
        }
      }
    }
    return pts;
  }

  function buildParticles() {
    particles = sampled.map(function (pt) {
      var colorIdx = Math.random() < 0.72 ? (Math.random() < 0.5 ? 0 : 1) : (Math.random() < 0.6 ? 2 : 3);
      return {
        hx: pt.x, hy: pt.y,                       // hogar (viewBox)
        x: pt.x + (Math.random() - 0.5) * 400,    // arranque disperso: el cerebro "se arma"
        y: pt.y + (Math.random() - 0.5) * 400,
        vx: 0, vy: 0,
        r: 0.9 + Math.random() * 1.3,
        color: COLORS[colorIdx],
        alpha: 0.55 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2
      };
    });
  }

  function resize() {
    var rect = stage.getBoundingClientRect();
    if (!rect.width) return;
    cw = rect.width;
    ch = rect.height;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var pad = 0.06;
    scale = Math.min(cw * (1 - pad * 2) / VIEW_W, ch * (1 - pad * 2) / VIEW_H);
    offX = (cw - VIEW_W * scale) / 2;
    offY = (ch - VIEW_H * scale) / 2;
  }

  function toScreen(x, y) {
    return { x: offX + x * scale, y: offY + y * scale };
  }

  function spawnIdea() {
    if (particles.length === 0) return;
    var src = particles[(Math.random() * particles.length) | 0];
    // preferir la parte superior del cerebro
    if (src.hy > 160 && Math.random() < 0.7) return;
    ideas.push({
      x: src.hx + (Math.random() - 0.5) * 10,
      y: src.hy,
      vy: -(0.25 + Math.random() * 0.35),
      vx: (Math.random() - 0.5) * 0.15,
      r: 1.2 + Math.random() * 1.6,
      life: 1
    });
    if (ideas.length > 40) ideas.shift();
  }

  function spawnWord(clientX) {
    if (!wordsLayer) return;
    var word = WORDS[wordIndex % WORDS.length];
    wordIndex++;
    var el = document.createElement('span');
    el.className = 'brain-word';
    el.textContent = word;
    var rect = stage.getBoundingClientRect();
    var xPct = clientX != null
      ? Math.max(8, Math.min(80, ((clientX - rect.left) / rect.width) * 100))
      : 15 + Math.random() * 60;
    el.style.left = xPct + '%';
    el.style.top = (28 + Math.random() * 30) + '%';
    el.style.fontSize = (0.85 + Math.random() * 0.5) + 'rem';
    wordsLayer.appendChild(el);
    setTimeout(function () { el.remove(); }, 3700);
  }

  function burst(cx, cy) {
    // cx, cy en coords viewBox
    particles.forEach(function (p) {
      var dx = p.x - cx, dy = p.y - cy;
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      var force = Math.max(0, 1 - d / 260) * (10 + Math.random() * 14);
      p.vx += (dx / d) * force;
      p.vy += (dy / d) * force;
    });
    for (var i = 0; i < 6; i++) spawnIdea();
  }

  var tick = 0;
  function frame() {
    tick++;
    ctx.clearRect(0, 0, cw, ch);

    var mvx = (mouse.x - offX) / scale;  // mouse en coords viewBox
    var mvy = (mouse.y - offY) / scale;
    var repelR = 55;

    ctx.globalCompositeOperation = 'lighter';

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // resorte hacia el hogar
      p.vx += (p.hx - p.x) * 0.012;
      p.vy += (p.hy - p.y) * 0.012;

      // repulsión del mouse: el cerebro se deshace bajo el cursor
      if (mouse.active) {
        var dx = p.x - mvx, dy = p.y - mvy;
        var d2 = dx * dx + dy * dy;
        if (d2 < repelR * repelR) {
          var d = Math.sqrt(d2) || 1;
          var f = (1 - d / repelR) * 2.2;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }

      // respiración sutil
      p.vx += Math.sin(tick * 0.01 + p.phase) * 0.004;
      p.vy += Math.cos(tick * 0.012 + p.phase) * 0.004;

      p.vx *= 0.9;
      p.vy *= 0.9;
      p.x += p.vx;
      p.y += p.vy;

      var s = toScreen(p.x, p.y);
      var rr = p.r * scale * 0.55;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(rr, 0.6), 0, 6.2832);
      ctx.fillStyle = p.color + (p.alpha * 0.9) + ')';
      ctx.fill();
    }

    // ideas que suben
    for (var j = ideas.length - 1; j >= 0; j--) {
      var idea = ideas[j];
      idea.x += idea.vx;
      idea.y += idea.vy;
      idea.life -= 0.006;
      if (idea.life <= 0) { ideas.splice(j, 1); continue; }
      var si = toScreen(idea.x, idea.y);
      ctx.beginPath();
      ctx.arc(si.x, si.y, idea.r * scale * 0.5, 0, 6.2832);
      ctx.fillStyle = 'rgba(224,190,126,' + (idea.life * 0.8) + ')';
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';

    if (tick % 40 === 0) spawnIdea();
    if (tick % 300 === 0 && !reduceMotion) spawnWord(null);

    if (running) requestAnimationFrame(frame);
  }

  function drawStatic() {
    // versión sin animación (reduced motion): cerebro fijo
    ctx.clearRect(0, 0, cw, ch);
    particles.forEach(function (p) {
      var s = toScreen(p.hx, p.hy);
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(p.r * scale * 0.55, 0.6), 0, 6.2832);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });
  }

  function hideHint() {
    if (hintHidden || !hint) return;
    hintHidden = true;
    hint.classList.add('is-hidden');
  }

  /* --- Interacción --- */
  stage.addEventListener('pointermove', function (e) {
    var rect = stage.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  stage.addEventListener('pointerleave', function () {
    mouse.active = false;
    mouse.x = -9999; mouse.y = -9999;
  });
  stage.addEventListener('pointerdown', function (e) {
    var rect = stage.getBoundingClientRect();
    var vx = (e.clientX - rect.left - offX) / scale;
    var vy = (e.clientY - rect.top - offY) / scale;
    burst(vx, vy);
    spawnWord(e.clientX);
    hideHint();
  });

  /* --- Arranque --- */
  sampled = samplePoints();
  buildParticles();
  resize();

  if (reduceMotion) {
    particles.forEach(function (p) { p.x = p.hx; p.y = p.hy; });
    drawStatic();
  } else {
    running = true;
    requestAnimationFrame(frame);
    // ocultar la pista después de la primera interacción o 12s
    setTimeout(hideHint, 12000);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      if (reduceMotion) drawStatic();
    }, 120);
  });

  // pausar cuando no está visible (batería/CPU)
  if ('IntersectionObserver' in window && !reduceMotion) {
    var brainObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !running) {
          running = true;
          requestAnimationFrame(frame);
        } else if (!entry.isIntersecting) {
          running = false;
        }
      });
    }, { threshold: 0.05 });
    brainObserver.observe(stage);
  }
})();
