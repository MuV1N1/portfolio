import { addEventListenerToModal, modalState } from '../utils/modal.ts';
import { firebaseClient } from './services/firebaseClient.ts';
import { DomClient } from './services/domClient.ts';
import { updateExistingProjectButtons } from './utils/projectRenderer.ts';

const dom = new DomClient();

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

  renderLoginButton(firebaseClient.isAuthenticated);
  firebaseClient.ready.then(() => {
    renderLoginButton(firebaseClient.isAuthenticated);
    updateExistingProjectButtons();
  });
  firebaseClient.onAuthChange((authed) => {
    renderLoginButton(authed);
    updateExistingProjectButtons();
  });

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (firebaseClient.isAuthenticated) {
      console.log('[login] User is authenticated, logging out');
      console.log(firebaseClient.auth().clear());
      firebaseClient.auth().clear();
      return;
    }
    modalState(modal, body, 'open');
    console.log('[login] User is not authenticated, opening login modal');
    console.log(firebaseClient.auth());

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
      const usersCollection = firebaseClient.collection('users') as any;
      if (usersCollection && typeof usersCollection.authWithPassword === 'function') {
        await usersCollection.authWithPassword(usernameInput.value, passwordInput.value);
      } else {
        throw new Error('authWithPassword is not available on users collection');
      }
      localStorage.setItem('lastUserName', usernameInput.value);
      modal.style.display = 'none';
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
