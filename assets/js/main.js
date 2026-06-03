/* DepartingNotes — interactions. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav-menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('nav-menu-open'); });
    });
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && !reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = prefix + target.toLocaleString() + suffix; return; }
      var start = null, dur = 1600;
      var tick = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.floor(eased * target);
        el.textContent = prefix + val.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      };
      requestAnimationFrame(tick);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Pricing annual/monthly toggle ---- */
  var planToggle = document.querySelector('.plan-toggle');
  if (planToggle) {
    var btns = planToggle.querySelectorAll('button');
    var setMode = function (mode) {
      btns.forEach(function (b) { b.classList.toggle('active', b.dataset.mode === mode); });
      document.querySelectorAll('[data-annual]').forEach(function (el) {
        el.textContent = mode === 'annual' ? el.dataset.annual : el.dataset.monthly;
      });
      document.querySelectorAll('[data-per]').forEach(function (el) {
        el.textContent = mode === 'annual' ? '/year · billed annually' : '/month · billed monthly';
      });
    };
    btns.forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode); }); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var a = item.querySelector('.faq-a');
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---- Toast helper ---- */
  window.showToast = function (msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.querySelector('.msg').textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 4000);
  };

  /* ---- Generic form validation + fake submit ---- */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      form.querySelectorAll('[required]').forEach(function (input) {
        var bad = false;
        if (input.type === 'checkbox') bad = !input.checked;
        else if (input.type === 'email') bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value);
        else bad = !input.value.trim();
        var fieldErr = input.closest('.field') && input.closest('.field').querySelector('.error');
        input.classList.toggle('invalid', bad);
        if (fieldErr) fieldErr.classList.toggle('show', bad);
        if (bad && !firstBad) firstBad = input;
        if (bad) ok = false;
      });
      if (!ok) { if (firstBad) firstBad.focus(); return; }
      var btn = form.querySelector('[type=submit]');
      if (btn) { btn.disabled = true; var orig = btn.textContent; btn.textContent = 'Sending…'; }
      setTimeout(function () {
        window.showToast(form.dataset.success || 'Thank you — we received your message.');
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = orig; }
        if (form.dataset.redirect) setTimeout(function(){ location.href = form.dataset.redirect; }, 900);
      }, 1100);
    });
    /* clear error on input */
    form.querySelectorAll('input,select,textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        input.classList.remove('invalid');
        var fe = input.closest('.field') && input.closest('.field').querySelector('.error');
        if (fe) fe.classList.remove('show');
      });
    });
  });

  /* ---- Multi-step registration ---- */
  var reg = document.querySelector('[data-stepper-form]');
  if (reg) {
    var steps = reg.querySelectorAll('[data-step]');
    var dots = document.querySelectorAll('.stepper .dot');
    var current = 0;
    var show = function (i) {
      steps.forEach(function (s, idx) { s.hidden = idx !== i; });
      dots.forEach(function (d, idx) {
        d.classList.toggle('active', idx === i);
        d.classList.toggle('done', idx < i);
      });
      current = i;
      window.scrollTo({ top: reg.offsetTop - 120, behavior: reduce ? 'auto' : 'smooth' });
    };
    reg.querySelectorAll('[data-next]').forEach(function (b) {
      b.addEventListener('click', function () {
        var stepEl = steps[current];
        var ok = true, firstBad = null;
        stepEl.querySelectorAll('[required]').forEach(function (input) {
          var bad = input.type === 'checkbox' ? !input.checked
            : input.type === 'email' ? !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)
            : !input.value.trim();
          input.classList.toggle('invalid', bad);
          var fe = input.closest('.field') && input.closest('.field').querySelector('.error');
          if (fe) fe.classList.toggle('show', bad);
          if (bad && !firstBad) firstBad = input;
          if (bad) ok = false;
        });
        if (!ok) { if (firstBad) firstBad.focus(); return; }
        if (current < steps.length - 1) show(current + 1);
      });
    });
    reg.querySelectorAll('[data-back]').forEach(function (b) {
      b.addEventListener('click', function () { if (current > 0) show(current - 1); });
    });
    /* plan pre-selection from query string + plan cards */
    var params = new URLSearchParams(location.search);
    var planInput = reg.querySelector('[name=plan]');
    var setPlan = function (val) {
      if (planInput) planInput.value = val;
      reg.querySelectorAll('[data-plan]').forEach(function (c) {
        c.classList.toggle('featured', c.dataset.plan === val);
      });
    };
    reg.querySelectorAll('[data-plan]').forEach(function (c) {
      c.addEventListener('click', function () { setPlan(c.dataset.plan); });
    });
    if (params.get('plan')) setPlan(params.get('plan'));
    reg.addEventListener('submit', function (e) {
      e.preventDefault();
      window.showToast('Welcome to DepartingNotes. Your legacy starts now.');
    });
  }

  /* ---- Year in footer ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- File input label ---- */
  document.querySelectorAll('.file-drop input[type=file]').forEach(function (input) {
    var drop = input.closest('.file-drop');
    var label = drop.querySelector('.file-name');
    input.addEventListener('change', function () {
      if (input.files.length && label) label.textContent = input.files[0].name;
    });
    ['dragover', 'dragenter'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('drag'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('drag'); });
    });
  });
})();
