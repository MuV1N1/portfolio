import PocketBase from 'pocketbase';
const pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('.login-button') as HTMLLabelElement | null;
  const modal = document.getElementById('login-modal') as HTMLDivElement | null;
  const closeBtn = document.querySelector('#login-modal .close-modal') as HTMLSpanElement | null;
  const loginForm = document.getElementById('login-form') as HTMLFormElement | null;

  if (!loginButton || !modal || !closeBtn || !loginForm) {
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

  const getIsAuthenticated = () => pb.authStore.isValid;

  renderLoginButton(getIsAuthenticated());

  loginButton.addEventListener('click', () => {
    if (getIsAuthenticated()) {
      pb.authStore.clear();
      renderLoginButton(false);
      window.location.reload();
      return;
    }
    modal.style.display = 'block';
  });

  // Modal controls
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Login form submit
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
        localStorage.setItem('isAuthenticated', 'true'); // kept for compatibility with other scripts
        renderLoginButton(true);
        modal.style.display = 'none';
        window.location.reload();
      }
    } catch (error) {
      alert('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (passwordInput) passwordInput.value = '';
    }
  });
});

