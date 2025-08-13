import { addEventListenerToModal, modalState } from '../utils/modal.ts';
import { FirebaseClient } from './services/firebaseClient.ts';
import { DomClient } from './services/domClient.ts';

const dom = new DomClient();
const pb = new FirebaseClient();

function initLogin() {
  const loginButton = dom.getLabelElement(document, 'login-button', 'class');
  const modal = dom.getDivElement(document, 'login-modal');
  const body = dom.getBody(document);
  const closeBtn = dom.getSpanElement(document, '#login-modal .close-modal');
  const loginForm = dom.getFormElement(document, 'login-form');

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

  addEventListenerToModal(modal, body);

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
