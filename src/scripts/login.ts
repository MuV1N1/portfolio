import PocketBase from 'pocketbase';
const pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');

const loginButton = document.querySelector('.login-button') as HTMLLabelElement;
const modal = document.getElementById('login-modal') as HTMLDivElement;
const closeBtn = document.querySelector('#login-modal .close-modal') as HTMLSpanElement;
const loginForm = document.getElementById('login-form') as HTMLFormElement;
const loginText = document.querySelector('.login-text') as HTMLSpanElement;

function setAuthenticatedUI(isAuthenticated: boolean) {
  if (isAuthenticated) {
    loginText.textContent = 'Logout';
    loginButton.innerHTML = `
      <button class="logout-button-icon"></button>
      <span class="login-text">Logout</span>
    `;
  } else {
    loginText.textContent = 'Login';
    loginButton.innerHTML = `
      <button class="login-button-icon"></button>
      <span class="login-text">Login</span>
    `;
  }
}

const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
setAuthenticatedUI(isAuthenticated);

loginButton.addEventListener('click', () => {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  if (isAuth) {
    localStorage.setItem('isAuthenticated', 'false');
    setAuthenticatedUI(false);
    window.location.reload();
    return;
  }
  modal.style.display = 'block';
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

  const usernameInput = document.getElementById('username') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  try {
    await pb.collection('users').authWithPassword(usernameInput.value, passwordInput.value);
    localStorage.setItem('isAuthenticated', 'true');
    setAuthenticatedUI(true);
    window.location.reload();
    modal.style.display = 'none';
  } catch (error) {
    alert('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
  }
});

