/* DepartingNotes — Dashboard app shell (Member + Admin). Vanilla JS. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- View switching ---- */
  var links = document.querySelectorAll('.side-link[data-view]');
  var views = document.querySelectorAll('.view');
  var titleEl = document.querySelector('[data-page-title]');
  var subEl = document.querySelector('[data-page-sub]');

  function activate(view) {
    var link = document.querySelector('.side-link[data-view="' + view + '"]');
    if (!link) return;
    links.forEach(function (l) { l.classList.toggle('active', l === link); });
    views.forEach(function (v) { v.classList.toggle('active', v.id === 'view-' + view); });
    if (titleEl) titleEl.textContent = link.dataset.title || link.textContent.trim();
    if (subEl) subEl.textContent = link.dataset.sub || '';
    document.querySelector('.app').classList.remove('nav-open');
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view);
    animateView(document.getElementById('view-' + view));
  }
  links.forEach(function (l) {
    l.addEventListener('click', function () { activate(l.dataset.view); });
  });
  // deep-link via hash + any [data-go] buttons
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () { activate(b.dataset.go); });
  });
  var initial = (location.hash || '').replace('#', '');
  activate(document.querySelector('.side-link[data-view="' + initial + '"]') ? initial
    : (links[0] && links[0].dataset.view));

  /* ---- Animate bars / rings / progress when a view becomes visible ---- */
  function animateView(view) {
    if (!view) return;
    view.querySelectorAll('.bar[data-h]').forEach(function (b) {
      b.style.height = (reduce ? b.dataset.h : '0') + '%';
      if (!reduce) requestAnimationFrame(function () { setTimeout(function () { b.style.height = b.dataset.h + '%'; }, 60); });
    });
    view.querySelectorAll('.pbar i[data-w]').forEach(function (i) {
      i.style.width = (reduce ? i.dataset.w : '0') + '%';
      if (!reduce) requestAnimationFrame(function () { setTimeout(function () { i.style.width = i.dataset.w + '%'; }, 60); });
    });
    view.querySelectorAll('.ring[data-p]').forEach(function (r) {
      var target = parseInt(r.dataset.p, 10);
      if (reduce) { r.style.setProperty('--p', target); return; }
      var start = null;
      function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / 1200, 1);
        r.style.setProperty('--p', Math.round(p * target)); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }

  /* ---- Mobile sidebar ---- */
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', function () { document.querySelector('.app').classList.toggle('nav-open'); });
  document.querySelector('.app').addEventListener('click', function (e) {
    if (e.target === this && this.classList.contains('nav-open')) this.classList.remove('nav-open');
  });

  /* ---- Toast ---- */
  window.showToast = function (msg) {
    var t = document.getElementById('toast'); if (!t) return;
    t.querySelector('.msg').textContent = msg; t.classList.add('show');
    clearTimeout(t._timer); t._timer = setTimeout(function () { t.classList.remove('show'); }, 3500);
  };

  /* ---- Admin verify queue: Approve / Hold / Reject ---- */
  document.querySelectorAll('[data-verify]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.verify-card');
      var action = btn.dataset.verify;
      var name = card.dataset.member || 'the member';
      if (action === 'reject' && !confirm('Reject this submission and flag it for review? This cannot be undone.')) return;
      if (action === 'approve' && !confirm('Approve release for ' + name + "? This begins release according to the member's chosen timing rules (immediate, or delayed up to one year).")) return;
      var msg = { approve: 'Release approved — delivery will follow the member\'s timing rules.', hold: 'Placed on hold — executor will be asked for more information.', reject: 'Submission rejected and flagged for security review.' }[action];
      card.style.transition = 'opacity .4s, transform .4s'; card.style.opacity = '.45';
      var statusEl = card.querySelector('[data-status]');
      if (statusEl) {
        statusEl.className = 'badge-pill ' + ({ approve: 'b-active', hold: 'b-hold', reject: 'b-hold' }[action]);
        statusEl.textContent = { approve: 'Approved', hold: 'On hold', reject: 'Rejected' }[action];
      }
      card.querySelectorAll('[data-verify]').forEach(function (b) { b.disabled = true; b.style.opacity = '.5'; b.style.cursor = 'default'; });
      // update pending badge count
      var badge = document.querySelector('[data-pending-count]');
      if (badge) { var n = Math.max(0, parseInt(badge.textContent, 10) - 1); badge.textContent = n; if (!n) badge.style.display = 'none'; }
      window.showToast(msg);
    });
  });

  /* ---- Copy invite link ---- */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.dataset.copy;
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function(){ window.showToast('Invite link copied to clipboard.'); });
      else window.showToast('Invite link: ' + text);
    });
  });

  /* ---- Generic demo buttons ---- */
  document.querySelectorAll('[data-toast]').forEach(function (b) {
    b.addEventListener('click', function () { window.showToast(b.dataset.toast); });
  });

  /* ---- Segmented controls (EN/ES, etc) ---- */
  document.querySelectorAll('.seg').forEach(function (seg) {
    seg.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        seg.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        if (b.dataset.segToast) window.showToast(b.dataset.segToast);
      });
    });
  });

  /* ---- Toggle switches feedback ---- */
  document.querySelectorAll('.switch input[data-toggle-msg]').forEach(function (i) {
    i.addEventListener('change', function () { window.showToast(i.checked ? i.dataset.toggleMsg + ' enabled.' : i.dataset.toggleMsg + ' disabled.'); });
  });

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
