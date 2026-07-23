// Sticky header solid on scroll
const header = document.getElementById('siteHeader');
function updateHeaderSolid(){
  if(header) header.classList.toggle('solid', window.scrollY > 30);
}
window.addEventListener('scroll', updateHeaderSolid);
updateHeaderSolid();

// Mobile nav open/close
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
if(burger){
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Dropdown nav items (desktop: hover + click toggle; mobile: click/accordion)
document.querySelectorAll('.nav-item').forEach(item => {
  const btn = item.querySelector('button.nav-top');
  if(!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.nav-item.open').forEach(i => { if(i !== item) i.classList.remove('open'); });
    item.classList.toggle('open', !wasOpen);
  });
});
document.addEventListener('click', (e) => {
  if(!e.target.closest('.nav-item')){
    document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
  }
});
// Close mobile menu when a plain link is clicked
document.querySelectorAll('nav.links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
}));

// Tabs (scoped per tabbar so multiple tab groups on one page work independently)
document.querySelectorAll('.tabbar').forEach(bar => {
  const buttons = bar.querySelectorAll('.tabbtn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.tab;
      const panels = bar.parentElement.querySelectorAll('.tabpanel');
      panels.forEach(p => p.classList.toggle('active', p.id === 'tab-' + key));
    });
  });
});

// ---------------------------------------------------------------------------
// Client session helpers (shared by the login modal and the portal page)
// ---------------------------------------------------------------------------
const SESSION_KEY = 'scaleprove_session';       // this browser tab only
const REMEMBER_KEY = 'scaleprove_remembered';   // persists across tabs/visits

function findAccount(email, password){
  const list = (typeof CLIENT_ACCOUNTS !== 'undefined') ? CLIENT_ACCOUNTS : [];
  return list.find(acc =>
    acc.email.toLowerCase() === String(email).toLowerCase() &&
    acc.password === password
  );
}

function getActiveSession(){
  const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(REMEMBER_KEY);
  if(!raw) return null;
  try{ return JSON.parse(raw); }catch(e){ return null; }
}

function clearSession(){
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

// If already logged in, "Client login" buttons become "My Portal" and skip the modal
const activeSession = getActiveSession();
if(activeSession){
  document.querySelectorAll('[data-login-trigger]').forEach(el => {
    el.textContent = 'My Portal';
  });
}

// Login modal — handles the form only; the tools live on portal.html
const modal = document.getElementById('loginModal');
if(modal){
  const modalClose = document.getElementById('modalClose');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  function openModal(){
    if(getActiveSession()){
      window.location.href = 'portal.html';
      return;
    }
    modal.classList.add('open');
    if(loginError) loginError.style.display = 'none';
    loginForm.reset();
  }
  function closeModal(){
    modal.classList.remove('open');
  }
  document.querySelectorAll('[data-login-trigger]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('rememberMe');
    const account = findAccount(email, password);

    if(!account){
      if(loginError){
        loginError.textContent = "That email or password doesn't match our records. Double-check and try again.";
        loginError.style.display = 'block';
      }
      return;
    }
    const session = JSON.stringify({ email: account.email, name: account.name });
    sessionStorage.setItem(SESSION_KEY, session);
    if(remember && remember.checked){
      localStorage.setItem(REMEMBER_KEY, session);
    }
    window.location.href = 'portal.html';
  });

  // If redirected here because portal.html required a login, open the modal automatically
  if(new URLSearchParams(window.location.search).get('login') === 'required'){
    openModal();
  }
}

// Portal page (portal.html only — guarded so this file can stay shared)
const portalRoot = document.getElementById('portalView');
if(portalRoot){
  const session = getActiveSession();
  if(!session){
    window.location.href = 'index.html?login=required';
  } else {
    const greetingEl = document.getElementById('portalGreeting');
    if(greetingEl) greetingEl.textContent = 'Welcome back, ' + session.name + ' 👋';
    const logoutBtn = document.getElementById('portalLogout');
    if(logoutBtn){
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearSession();
        window.location.href = 'index.html';
      });
    }
  }
}
