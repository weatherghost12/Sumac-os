document.addEventListener('DOMContentLoaded', () => {
  /* ======= Mobile Menu ======= */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  const setMenu = (open) => {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      setMenu(!isOpen);
    });
  }

  document.querySelectorAll('[data-close-menu]').forEach(el => {
    el.addEventListener('click', () => setMenu(false));
  });

  /* ======= Testimonials Slider ======= */
  const slides = Array.from(document.querySelectorAll('.testimonial'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let current = slides.findIndex(el => el.classList.contains('active'));
  if (current < 0) current = 0;

  function showSlide(index) {
    const total = slides.length;
    const i = (index + total) % total;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => {
      d.classList.remove('active');
      d.setAttribute('aria-selected', 'false');
    });

    slides[i].classList.add('active');
    dots[i].classList.add('active');
    dots[i].setAttribute('aria-selected', 'true');
    current = i;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

  /* Keyboard support for dots */
  dots.forEach((dot, i) => {
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(i + 1); dots[(i+1)%dots.length].focus(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); showSlide(i - 1); dots[(i-1+dots.length)%dots.length].focus(); }
    });
  });

  /* ======= Auth Modal ======= */
  const openers = document.querySelectorAll('[data-open]');
  const modal = document.getElementById('login-modal');
  const closeBtn = modal?.querySelector('[data-close-modal]');
  const tabBtns = modal?.querySelectorAll('.tab-btn');
  const tabPanels = modal?.querySelectorAll('.tab-content');

  function openModal() { if (!modal) return; modal.setAttribute('open',''); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeModal() { if (!modal) return; modal.removeAttribute('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

  openers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Tabs
  tabBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active')); 
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      modal.querySelector(`#${btn.dataset.tab}`)?.classList.add('active');
    });
  });

  /* ======= Finder Filtering ======= */
  const form = document.getElementById('filter-form');
  const cards = Array.from(document.querySelectorAll('.profile-card'));

  function passesExp(card, expVal) {
    const allowed = (card.dataset.exp || '').split(',').map(s => s.trim());
    return allowed.includes(String(expVal));
  }

  function filterCards() {
    const exp = document.getElementById('exp').value; // 1..5
    const use = document.getElementById('use').value; // privacy/dev/...
    const base = document.getElementById('base').value; // debian/arch
    const spec = document.getElementById('spec').value; // low/modern/arm64

    let visibleCount = 0;
    cards.forEach(card => {
      const okExp = passesExp(card, exp);
      const okUse = !use || card.dataset.use === use;
      const okBase = !base || card.dataset.base === base;
      const okSpec = !spec || card.dataset.spec === spec;
      const show = okExp && okUse && okBase && okSpec;

      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // Update fake stats just for vibes
    const downloads = document.getElementById('stat-downloads');
    if (downloads) downloads.textContent = String(Math.max(visibleCount * 123, 0));
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    filterCards();
  });

  // Initial filter (show all)
  filterCards();

  /* ======= Simple form demo (no real submit) ======= */
  document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('We would generate a tailored link here (demo).');
  });

  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Logged in (demo).');
  });

  document.getElementById('signup-modal-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Account created (demo).');
  });
});
/* ===== Account page logic (safe) ===== */
document.addEventListener('DOMContentLoaded', () => {
  // only run on pages with the account card, and only once
  if (window.__sumacAccountInit) return;
  if (!document.querySelector('.auth-card')) return;
  window.__sumacAccountInit = true;
  // --- Supabase auth wiring ---
  const SUPABASE_URL = "https://zzdjvhhpzvvihwbyiaer.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZGp2aGhwenZ2aWh3YnlpYWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NTg3NjcsImV4cCI6MjA3MDQzNDc2N30.O9fzrzDWV2zAwXBtoG8nxc8DaoMQ4X11uJXYUQ0gVms";
  const sb = window.supabase?.createClient ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;


  // Tabs (for account page)
  const pageTabs = document.querySelectorAll('.page-tabs .tab-btn');
  const panels = document.querySelectorAll('.auth-card .tab-content');
  pageTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      pageTabs.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });

  // Allow [data-switch="panel-id"] links to change tabs
  document.querySelectorAll('[data-switch]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-switch');
      const targetBtn = Array.from(pageTabs).find(b => b.dataset.tab === id);
      targetBtn?.click();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Show/Hide password toggles
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-for');
      const input = document.getElementById(id);
      if (!input) return;
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      btn.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
      const icon = btn.querySelector('i');
      if (icon) icon.className = isPwd ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    });
  });

  // Password strength meter
  const pass = document.getElementById('su-pass2');
  const meterBars = pass ? Array.from(pass.closest('.input-with-icon').querySelectorAll('.meter span')) : [];
  const strengthLabel = document.getElementById('pass-strength');
  function scorePassword(v) {
    let score = 0;
    if (v.length >= 8) score++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    return Math.max(0, Math.min(4, score));
  }
  function renderStrength(s) {
    meterBars.forEach((bar, i) => bar.classList.toggle('active', i < s));
    if (!strengthLabel) return;
    const map = ['—', 'Weak', 'Fair', 'Good', 'Strong'];
    strengthLabel.textContent = `Strength: ${map[s]}`;
  }
  pass?.addEventListener('input', () => renderStrength(scorePassword(pass.value)));
  if (pass) renderStrength(scorePassword(pass.value || ''));

  // Confirm password match hint
  const pass2 = document.getElementById('su-pass2-confirm');
  const matchHint = document.getElementById('match-hint');
  function checkMatch() {
    if (!pass || !pass2 || !matchHint) return;
    if (!pass2.value) { matchHint.textContent = ''; matchHint.className = 'hint'; return; }
    const ok = pass.value === pass2.value;
    matchHint.textContent = ok ? 'Passwords match.' : 'Passwords do not match.';
    matchHint.className = 'hint ' + (ok ? 'ok' : 'bad');
  }
  pass2?.addEventListener('input', checkMatch);
  pass?.addEventListener('input', checkMatch);

  // Demo submit handlers (replace with real API later)
  document.getElementById('login-page-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sb) return alert('Supabase SDK not loaded.');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-pass').value;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); return; }
    alert('Logged in!');
  });
  document.getElementById('signup-page-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sb) return alert('Supabase SDK not loaded.');
    const tos = document.getElementById('su-tos');
    if (tos && !tos.checked) { alert('Please agree to the Terms and Privacy Policy.'); return; }
    const email = document.getElementById('su-email2').value.trim();
    const password = document.getElementById('su-pass2').value;
    const { error } = await sb.auth.signUp({ email, password });
    if (error) { alert(error.message); return; }
    alert('Check your email to confirm your account.');
  });
  document.getElementById('reset-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sb) return alert('Supabase SDK not loaded.');
    const email = document.getElementById('reset-email').value.trim();
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: location.origin + '/account.html'
    });
    if (error) { alert(error.message); return; }
    alert('Reset link sent. Check your email.');
  });
});


  // Reflect session state in console (optional)
  try {
    sb?.auth.onAuthStateChange((_event, session) => {
      console.log('Auth:', _event, session?.user?.email || null);
    });
  } catch (e) {}
