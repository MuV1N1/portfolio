import { modalState } from '../utils/modal.ts';
import { PocketBaseClient } from '../services/pocketbaseClient';

const pb = new PocketBaseClient();

function initLogin() {
  const loginButton = document.querySelector('.login-button') as HTMLLabelElement | null;
  const modal = document.getElementById('login-modal') as HTMLDivElement | null;
  const body = document.querySelector('body') as HTMLBodyElement;
  const closeBtn = document.querySelector('#login-modal .close-modal') as HTMLSpanElement | null;
  const loginForm = document.getElementById('login-form') as HTMLFormElement | null;

  if (!loginButton || !modal || !closeBtn || !loginForm) {
    console.warn('[login] Required DOM nodes missing', { hasLoginButton: !!loginButton, hasModal: !!modal, hasCloseBtn: !!closeBtn, hasLoginForm: !!loginForm });
    return;
  }

  const renderLoginButton = (isAuthenticated: boolean) => {
    loginButton.innerHTML = '';

    const iconBtn = document.createElement('button');
    iconBtn.className = isAuthenticated ? 'logout-button-icon' : 'login-button-icon';

    const textSpan = document.createElement('span');
    textSpan.className = 'login-text';
    textSpan.textContent = isAuthenticated ? 'Logout' : 'Login';

    loginButton.append(iconBtn, textSpan);
  };

  const getIsAuthenticated = () => pb.isAuthenticated;

  renderLoginButton(getIsAuthenticated());

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (getIsAuthenticated()) {
      pb.auth().clear();
      renderLoginButton(false);
      window.location.reload();
      return;
    }
    modalState(modal, body, 'open');

    const usernameInput = document.getElementById('username') as HTMLInputElement | null;
    if (usernameInput) {
      const last = localStorage.getItem('lastUserName') || '';
      usernameInput.value = last;
    }
  });

  closeBtn.addEventListener('click', () => {
    modalState(modal, body, 'close');
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modalState(modal, body, 'close');
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
      if (pb.isAuthenticated) {
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

export default function initLoginWithDom() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogin);
  } else {
    initLogin();
  }
}
