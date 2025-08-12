import PocketBase from 'pocketbase';
const pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');

console.log('[login] module loaded');

function initLogin() {
  console.log('[login] DOM ready, initializing');

  const loginButton = document.querySelector('.login-button') as HTMLLabelElement | null;
  const modal = document.getElementById('login-modal') as HTMLDivElement | null;
  const closeBtn = document.querySelector('#login-modal .close-modal') as HTMLSpanElement | null;
  const loginForm = document.getElementById('login-form') as HTMLFormElement | null;

  if (!loginButton || !modal || !closeBtn || !loginForm) {
    console.warn('[login] Required DOM nodes missing', { hasLoginButton: !!loginButton, hasModal: !!modal, hasCloseBtn: !!closeBtn, hasLoginForm: !!loginForm });
    return;
  }

  const renderLoginButton = (isAuthenticated: boolean) => {
    console.log('[login] render button, isAuthenticated:', isAuthenticated);
    loginButton.innerHTML = '';

    const iconBtn = document.createElement('button');
    iconBtn.className = isAuthenticated ? 'logout-button-icon' : 'login-button-icon';

    const textSpan = document.createElement('span');
    textSpan.className = 'login-text';
    textSpan.textContent = isAuthenticated ? 'Logout' : 'Login';

    loginButton.append(iconBtn, textSpan);
  };

  const getIsAuthenticated = () => pb.authStore.isValid;

  renderLoginButton(getIsAuthenticated());

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[login] login button click');
    if (getIsAuthenticated()) {
      console.log('[login] logging out');
      pb.authStore.clear();
      renderLoginButton(false);
      window.location.reload();
      return;
    }
    modal.style.display = 'block';

    const usernameInput = document.getElementById('username') as HTMLInputElement | null;
    if (usernameInput) {
      const last = localStorage.getItem('lastUserName') || '';
      usernameInput.value = last;
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    if (!usernameInput || !passwordInput) return;

    const submitBtn = loginForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (submitBtn) submitBtn.disabled = true;

    try {
      await pb.collection('users').authWithPassword(usernameInput.value, passwordInput.value);
      if (pb.authStore.isValid) {
        renderLoginButton(true);
        modal.style.display = 'none';
        window.location.reload();
        localStorage.setItem('lastUserName', usernameInput.value);
      }
    } catch (error) {
      alert('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (passwordInput) passwordInput.value = '';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogin);
} else {
  initLogin();
}

