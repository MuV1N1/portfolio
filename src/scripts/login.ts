import { addEventListenerToModal, modalState } from './utils/modal.ts';
import { firebaseClient } from './services/firebaseClient.ts';
import { DomClient } from './services/domClient.ts';
import { updateExistingProjectButtons } from './utils/projectRenderer.ts';
import { customAlert } from './utils/dialog.ts';

const dom = new DomClient();

function initLogin() {
  const loginButton = dom.getLabelElement(document, 'login-button', 'class');
  const modal = dom.getDivElement(document, 'login-modal');
  const body = dom.getBody(document);
  const closeBtn = dom.getSpanElement(document, '#login-modal .close-modal');
  const loginForm = dom.getFormElement(document, 'login-form');

  if (!loginButton || !modal || !closeBtn || !loginForm) {
    throw new Error('[login] Required DOM nodes missing' + JSON.stringify({
      hasLoginButton: !!loginButton,
      hasModal: !!modal,
      hasCloseBtn: !!closeBtn,
      hasLoginForm: !!loginForm
    }));
  }


  const renderLoginButton = (isAuthenticated: boolean) => {
    loginButton.innerHTML = '';

    const isAuthorized = isAuthenticated && firebaseClient.isAuthorizedUser();

    const iconBtn = document.createElement('button');
    iconBtn.className = isAuthorized ? 'logout-button-icon' : 'login-button-icon';

    const textSpan = document.createElement('span');
    textSpan.className = 'login-text';
    textSpan.textContent = isAuthorized ? 'Abmelden' : 'Anmelden';

    loginButton.append(iconBtn, textSpan);
  };

  renderLoginButton(firebaseClient.isAuthenticated);
  firebaseClient.ready.then(() => {
    renderLoginButton(firebaseClient.isAuthenticated);
    if (firebaseClient.isAuthenticated && firebaseClient.isAuthorizedUser()) {
      updateExistingProjectButtons();
    }
  });
  firebaseClient.onAuthChange((authed) => {
    renderLoginButton(authed);
    if (authed && firebaseClient.isAuthorizedUser()) {
      updateExistingProjectButtons();
    } else {
      // Make sure buttons are hidden when not authorized or not authenticated
      updateExistingProjectButtons();
    }
  });

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (firebaseClient.isAuthenticated && firebaseClient.isAuthorizedUser()) {
      console.log('[login] User is authenticated, logging out');
      console.log(firebaseClient.auth().clear());
      firebaseClient.auth().clear();
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
      const usersCollection = firebaseClient.collection('users') as any;
      if (usersCollection && typeof usersCollection.authWithPassword === 'function') {
        const auth = await usersCollection.authWithPassword(usernameInput.value, passwordInput.value);
        console.log(auth.user.uid === '06MDZrzm8kghwU3iwqV7ji3u0Kx2');
        if (auth.user.uid !== '06MDZrzm8kghwU3iwqV7ji3u0Kx2') {
          console.log('[login] Unauthorized user, showing alert');
          // Sign out the unauthorized user immediately
          await firebaseClient.auth().clear();
          customAlert({
            title: 'Anmeldung fehlgeschlagen',
            message: 'Du bist nicht berechtigt, dich anzumelden.',
            confirmText: 'OK'
          });
        } else {
          localStorage.setItem('lastUserName', usernameInput.value);
          modalState(modal, body, 'close');
        }
      } else {
        throw new Error('authWithPassword is not available on users collection');
      }

    } catch (error) {
      customAlert({
        title: 'Anmeldung fehlgeschlagen',
        message: 'Bitte überprüfe deine Anmeldedaten und versuche es erneut.',
        confirmText: 'Erneut versuchen'
      })
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
