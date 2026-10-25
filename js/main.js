/* ==========================================================================
   Prabath Sandeepa — Portfolio
   1.  Hero: SANDEEPA slams in (shake, shockwave, haptics); letters stay touchable
   2.  Social icons: fill-from-pointer + magnetic tilt
   3.  Dark / Light switch with a circular reveal
   4.  Xenzura vault (a secret that never opens)
   5.  Certificate viewer
   6.  Scroll extras: progress bar, highlight sweep, number count-up
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canWAAPI = typeof Element.prototype.animate === 'function';

  var page = document.getElementById('page');
  var fx = document.getElementById('fx');
  var word = document.getElementById('slam');

  var rand = function (min, max) { return min + Math.random() * (max - min); };
  var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

  /* Footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Impact toolkit
  ------------------------------------------------------------------ */
  function vibrate(pattern) {
    try {
      var ua = navigator.userActivation;
      if (ua && !ua.hasBeenActive) return;   // browsers block it until the first tap
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (e) { /* not supported */ }
  }

  /* Run cb when an animation really reaches time t (timers drift; the timeline doesn't) */
  function whenAt(anim, t, cb) {
    (function tick() {
      if (anim.playState === 'finished' || anim.playState === 'idle' || (anim.currentTime || 0) >= t) cb();
      else window.requestAnimationFrame(tick);
    })();
  }

  function shake(power) {
    if (reduced || !canWAAPI || !page) return;
    var steps = 9;
    var amp = 6 * power;
    var frames = [];
    for (var i = 0; i < steps; i++) {
      var decay = 1 - i / steps;
      frames.push({
        transform: 'translate(' + (rand(-1, 1) * amp * decay).toFixed(2) + 'px,' +
                   (rand(-1, 1) * amp * decay).toFixed(2) + 'px) rotate(' +
                   (rand(-1, 1) * 0.35 * power * decay).toFixed(3) + 'deg)'
      });
    }
    frames.push({ transform: 'none' });
    page.animate(frames, { duration: 240 + 160 * power, easing: 'linear' });
  }

  function ring(x, y, width, height) {
    if (reduced || !canWAAPI || !fx) return;
    var el = document.createElement('i');
    el.className = 'ring';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    fx.appendChild(el);
    var a = el.animate(
      [
        { transform: 'translate(-50%,-50%) scale(.1)', opacity: .95 },
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }
      ],
      { duration: 760, easing: 'cubic-bezier(.1,.7,.2,1)' }
    );
    a.onfinish = function () { el.remove(); };
  }

  function flash() {
    if (reduced || !canWAAPI || !fx) return;
    var el = document.createElement('div');
    el.className = 'flash';
    fx.appendChild(el);
    var a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 480, easing: 'ease-out' });
    a.onfinish = function () { el.remove(); };
  }

  function impact(ch, power, big) {
    var r = ch.getBoundingClientRect();
    ring(r.left + r.width / 2, r.bottom - r.height * 0.08, r.width * 2.6, r.width * 0.7);
    shake(power);
    vibrate(big ? [70, 40, 130] : 22);
    if (big && word) {
      flash();
      var c = word.getBoundingClientRect();
      ring(c.left + c.width / 2, c.bottom - c.height * 0.08, c.width * 1.5, c.width * 0.34);
    }
  }

  /* ------------------------------------------------------------------
     1. Hero — SANDEEPA slams in
  ------------------------------------------------------------------ */
  var letters = word ? Array.prototype.slice.call(word.querySelectorAll('.ch')) : [];
  var glyphs = word ? Array.prototype.slice.call(word.querySelectorAll('.glyph')) : [];
  var afters = Array.prototype.slice.call(document.querySelectorAll('.after'));

  function showAfters() {
    afters.forEach(function (el) { el.classList.add('is-in'); });
  }

  function showFinalState() {
    if (word) word.classList.add('is-armed');
    showAfters();
  }

  function slamFrames(rot) {
    return [
      { transform: 'translateY(-115vh) rotate(' + rot + 'deg)', easing: 'cubic-bezier(.55,0,.9,.45)', offset: 0 },
      { transform: 'translateY(0) rotate(0deg) scale(1,1)',      easing: 'ease-out',                   offset: 0.58 },
      { transform: 'translateY(0) rotate(0deg) scale(1.16,.76)', easing: 'ease-out',                   offset: 0.68 },
      { transform: 'translateY(-3%) rotate(0deg) scale(.97,1.07)', easing: 'ease-in-out',              offset: 0.82 },
      { transform: 'translateY(0) rotate(0deg) scale(1,1)',      offset: 1 }
    ];
  }

  function runSlam() {
    if (!letters.length || reduced || !canWAAPI) { showFinalState(); return; }

    var DUR = 820;
    var STEP = 115;
    var START = 280;
    var HIT = 0.58;
    var last = letters.length - 1;

    letters.forEach(function (ch, i) {
      var rot = (i % 2 ? 1 : -1) * rand(8, 22);
      var delay = START + i * STEP;
      var anim = ch.animate(slamFrames(rot), { duration: DUR, delay: delay, fill: 'backwards', easing: 'linear' });

      whenAt(anim, delay + DUR * HIT, function () {
        impact(ch, i === last ? 2.1 : 0.5 + i * 0.07, i === last);
        if (i === last) window.setTimeout(showAfters, 120);
      });
    });

    word.classList.add('is-armed');
  }

  /* Failsafe: never leave the hero hidden */
  window.setTimeout(showFinalState, 5000);

  var started = false;
  function go() {
    if (started) return;
    started = true;
    runSlam();
  }

  if (document.fonts && document.fonts.load) {
    Promise.race([
      document.fonts.load('800 1em "Bricolage"'),
      new Promise(function (res) { window.setTimeout(res, 1200); })
    ]).then(go, go);
  } else {
    go();
  }

  /* Tap / click a letter: it hops and slams back down */
  var hopping = new WeakSet();
  letters.forEach(function (ch) {
    ch.addEventListener('pointerdown', function () {
      if (reduced || !canWAAPI || hopping.has(ch)) return;
      hopping.add(ch);

      var DUR = 640;
      var rot = rand(-16, 16);
      var a = ch.animate(
        [
          { transform: 'translateY(0) rotate(0deg)', easing: 'cubic-bezier(.2,.7,.3,1)', offset: 0 },
          { transform: 'translateY(-.5em) rotate(' + rot + 'deg)', easing: 'cubic-bezier(.6,0,.9,.5)', offset: 0.4 },
          { transform: 'translateY(0) rotate(0deg) scale(1,1)', easing: 'ease-out', offset: 0.72 },
          { transform: 'translateY(0) rotate(0deg) scale(1.14,.8)', easing: 'ease-in-out', offset: 0.8 },
          { transform: 'translateY(0) rotate(0deg) scale(1,1)', offset: 1 }
        ],
        { duration: DUR, easing: 'linear' }
      );
      whenAt(a, DUR * 0.72, function () { impact(ch, 0.9, false); });
      a.onfinish = a.oncancel = function () { hopping.delete(ch); };
    });
  });

  /* Letters lean toward the pointer / finger */
  var px = -1e5, py = -1e5, queued = false;

  function paintProximity() {
    queued = false;
    letters.forEach(function (ch, i) {
      var r = ch.getBoundingClientRect();
      var dx = px - (r.left + r.width / 2);
      var dy = (py - (r.top + r.height / 2)) * 0.55;
      var p = clamp(1 - Math.hypot(dx, dy) / (r.width * 1.2), 0, 1);
      glyphs[i].style.setProperty('--p', p.toFixed(3));
    });
  }

  function queuePaint() {
    if (!queued) { queued = true; window.requestAnimationFrame(paintProximity); }
  }

  if (!reduced && letters.length) {
    window.addEventListener('pointermove', function (e) {
      px = e.clientX; py = e.clientY; queuePaint();
    }, { passive: true });

    var release = function (delay) {
      window.setTimeout(function () { px = py = -1e5; queuePaint(); }, delay);
    };
    window.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') release(380); });
    window.addEventListener('pointercancel', function () { release(0); });
    document.documentElement.addEventListener('pointerleave', function () { release(0); });
  }

  /* ------------------------------------------------------------------
     2. Social icons — fill from the pointer, magnetic tilt
  ------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('.soc'), function (a) {
    var slot = a.parentElement; // the <li> does not transform, so its box stays stable

    function setOrigin(e) {
      var r = slot.getBoundingClientRect();
      a.style.setProperty('--mx', clamp(e.clientX - r.left, 0, r.width).toFixed(1) + 'px');
      a.style.setProperty('--my', clamp(e.clientY - r.top, 0, r.height).toFixed(1) + 'px');
    }

    function relax() {
      a.style.setProperty('--tx', '0px');
      a.style.setProperty('--ty', '0px');
      a.style.setProperty('--rx', '0deg');
      a.style.setProperty('--ry', '0deg');
    }

    a.addEventListener('pointerenter', setOrigin);
    a.addEventListener('pointerdown', setOrigin);

    a.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || reduced) return;
      var r = slot.getBoundingClientRect();
      var nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      a.style.setProperty('--tx', (nx * 7).toFixed(2) + 'px');
      a.style.setProperty('--ty', (ny * 7 - 3).toFixed(2) + 'px');
      a.style.setProperty('--rx', (-ny * 16).toFixed(2) + 'deg');
      a.style.setProperty('--ry', (nx * 16).toFixed(2) + 'deg');
    });

    a.addEventListener('pointerleave', function (e) {
      setOrigin(e);   // the fill drains out toward the side the pointer left from
      relax();
    });
  });

  /* ------------------------------------------------------------------
     3. Dark / Light switch
  ------------------------------------------------------------------ */
  var toggle = document.getElementById('themeToggle');
  var meta = document.querySelector('meta[name="theme-color"]');
  var COLORS = { dark: '#060a2c', light: '#eef1ff' };

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function paintToggle(theme) {
    if (!toggle) return;
    var dark = theme === 'dark';
    toggle.setAttribute('aria-checked', dark ? 'true' : 'false');
    toggle.setAttribute('aria-label', dark ? 'Dark theme (switch to light)' : 'Light theme (switch to dark)');
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (meta) meta.setAttribute('content', COLORS[theme]);
    paintToggle(theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked */ }
  }

  function switchTheme(originX, originY) {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';

    if (reduced || !document.startViewTransition || !canWAAPI) {
      applyTheme(next);
      return;
    }

    var radius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY)
    );

    root.classList.add('vt');
    var t = document.startViewTransition(function () { applyTheme(next); });
    t.finished.then(function () { root.classList.remove('vt'); }, function () { root.classList.remove('vt'); });

    t.ready.then(function () {
      root.animate(
        { clipPath: [
          'circle(0px at ' + originX + 'px ' + originY + 'px)',
          'circle(' + radius + 'px at ' + originX + 'px ' + originY + 'px)'
        ] },
        { duration: 750, easing: 'cubic-bezier(.22,.7,.2,1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () { /* transition skipped */ });
  }

  paintToggle(currentTheme());

  if (toggle) {
    toggle.addEventListener('click', function (e) {
      var r = toggle.getBoundingClientRect();
      var x = e.clientX || r.left + r.width / 2;   // keyboard clicks report 0,0
      var y = e.clientY || r.top + r.height / 2;
      switchTheme(x, y);
    });
  }

  /* ------------------------------------------------------------------
     4. Xenzura vault — it never opens
  ------------------------------------------------------------------ */
  var vault = document.getElementById('vault');
  var vaultMsg = document.getElementById('vaultMsg');
  var vaultLive = document.getElementById('vaultLive');

  if (vault && vaultMsg) {
    var answers = ['Not yet.', 'Still a secret.', 'Nice try.', 'Patience.', "It's a secret."];
    var answerIndex = 0;
    var busy = false;
    var GLYPHS = '#%&@$?*+=/<>';

    var scramble = function (text, ms, done) {
      if (reduced) { vaultMsg.textContent = text; done(); return; }
      var t0 = performance.now();
      (function frame(now) {
        var t = clamp((now - t0) / ms, 0, 1);
        var reveal = Math.floor(t * text.length);
        var out = '';
        for (var i = 0; i < text.length; i++) {
          out += (i < reveal || text.charAt(i) === ' ')
            ? text.charAt(i)
            : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        }
        vaultMsg.textContent = out;
        if (t < 1) window.requestAnimationFrame(frame);
        else { vaultMsg.textContent = text; done(); }
      })(t0);
    };

    var peek = function () {
      if (busy) return;
      busy = true;

      var text = answers[answerIndex];
      answerIndex = (answerIndex + 1) % answers.length;

      vault.classList.add('is-peek', 'is-glitch');
      vibrate([30, 40, 30, 40, 60]);

      if (!reduced && canWAAPI) {
        vault.animate(
          [
            { transform: 'translate(0,0)' },
            { transform: 'translate(-7px,2px) rotate(-.3deg)' },
            { transform: 'translate(6px,-2px) rotate(.25deg)' },
            { transform: 'translate(-4px,1px)' },
            { transform: 'translate(3px,0)' },
            { transform: 'none' }
          ],
          { duration: 420, easing: 'linear' }
        );
      }

      scramble(text, 650, function () {
        if (vaultLive) vaultLive.textContent = text;
        window.setTimeout(function () {
          vault.classList.remove('is-peek', 'is-glitch');
          busy = false;
        }, 200);
      });
    };

    vault.addEventListener('click', peek);
    vault.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); peek(); }
    });
  }

  /* ------------------------------------------------------------------
     5. Certificate viewer
  ------------------------------------------------------------------ */
  var dlg = document.getElementById('certDialog');

  if (dlg) {
    var dImg = document.getElementById('certImg');
    var dTitle = document.getElementById('certTitle');
    var dCode = document.getElementById('certCode');
    var dClose = document.getElementById('certClose');

    var openCert = function (btn) {
      dImg.src = btn.getAttribute('data-img');
      dImg.alt = 'E-certificate: ' + btn.getAttribute('data-title') + ', University of Moratuwa';
      dTitle.textContent = btn.getAttribute('data-title');
      dCode.textContent = btn.getAttribute('data-code');
      root.classList.add('lock');
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    };

    Array.prototype.forEach.call(document.querySelectorAll('.cert__open'), function (btn) {
      btn.addEventListener('click', function () { openCert(btn); });
    });

    dClose.addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { root.classList.remove('lock'); });
  }

  /* ------------------------------------------------------------------
     5b. CV notice modal
  ------------------------------------------------------------------ */
  var cvDlg = document.getElementById('cvDialog');
  var cvBtn = document.getElementById('cvBtn');

  if (cvDlg && cvBtn) {
    var cvClose = document.getElementById('cvClose');
    var cvOk = document.getElementById('cvModalOk');
    var cvContact = document.getElementById('cvModalContact');

    var openCvModal = function (e) {
      if (e) e.preventDefault();
      root.classList.add('lock');
      if (typeof cvDlg.showModal === 'function') cvDlg.showModal();
      else cvDlg.setAttribute('open', '');
    };

    var closeCvModal = function () {
      if (typeof cvDlg.close === 'function') cvDlg.close();
      else cvDlg.removeAttribute('open');
      root.classList.remove('lock');
    };

    cvBtn.addEventListener('click', openCvModal);
    if (cvClose) cvClose.addEventListener('click', closeCvModal);
    if (cvOk) cvOk.addEventListener('click', closeCvModal);
    if (cvContact) cvContact.addEventListener('click', closeCvModal);
    cvDlg.addEventListener('click', function (e) { if (e.target === cvDlg) closeCvModal(); });
    cvDlg.addEventListener('close', function () { root.classList.remove('lock'); });
  }

  /* ------------------------------------------------------------------
     6. Scroll extras
  ------------------------------------------------------------------ */
  var progress = document.getElementById('progress');
  var ticking = false;

  function paintProgress() {
    ticking = false;
    var max = root.scrollHeight - window.innerHeight;
    var s = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    progress.style.setProperty('--s', s.toFixed(4));
  }

  if (progress) {
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(paintProgress); }
    }, { passive: true });
    paintProgress();
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var highlights = Array.prototype.slice.call(document.querySelectorAll('.hl'));

  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    var DURATION = 1400;
    var t0 = performance.now();
    (function frame(now) {
      var t = clamp((now - t0) / DURATION, 0, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(end * eased));
      if (t < 1) window.requestAnimationFrame(frame);
    })(t0);
  }

  if ('IntersectionObserver' in window) {
    if (!reduced) counters.forEach(function (el) { el.textContent = '0'; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        if (el.classList.contains('hl')) el.classList.add('is-in');
        else if (reduced) el.textContent = el.getAttribute('data-count');
        else countUp(el);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { io.observe(el); });
    highlights.forEach(function (el) { io.observe(el); });
  } else {
    highlights.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
