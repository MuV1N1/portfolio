import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
const loginButton = document.querySelector('.login-button') as HTMLLabelElement;
const modal = document.getElementById('login-modal') as HTMLDivElement;
const closeBtn = document.querySelector('.close-modal') as HTMLSpanElement;
const loginForm = document.getElementById('login-form') as HTMLFormElement;
const body = document.querySelector('body') as HTMLBodyElement;
const createProjectButton = document.getElementById('create-project-btn') as HTMLButtonElement;

loginButton.addEventListener('click', () => {
    modal.style.display = 'block';
    body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    body.style.overflow = 'auto';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        body.style.overflow = 'auto';
    }
});

if (localStorage.getItem('isAuthenticated') === 'true') {
    createProjectButton.style.display = 'block';
    loginButton.innerHTML = /*html*/ `
    <button class="logout-button-icon"></button>
      <span class="logout-text">Logout</span>
        `;
    loginButton.addEventListener('click', () => {
        localStorage.removeItem('isAuthenticated');
        createProjectButton.style.display = 'none';
        loginButton.innerHTML = /*html*/ `
        <button class="login-button-icon"></button>
          <span class="login-text">Login</span>
            `;
        pb.authStore.clear();
        modal.style.display = 'none';
        body.style.overflow = 'auto';
    });
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const username = usernameInput.value;
    const password = passwordInput.value;

    await pb.collection('users').authWithPassword(username, password)
        .then((authData) => {
            console.log('Login successful:', authData);
            modal.style.display = 'none';
            body.style.overflow = 'auto';
            passwordInput.value = '';
            localStorage.setItem('isAuthenticated', 'true');
            createProjectButton.style.display = 'block';
            loginButton.innerHTML = /*html*/ `
                <button class="logout-button-icon"></button>
                <span class="logout-text">Logout</span>
                    `;
            loginButton.addEventListener('click', () => {
                modal.style.display = 'block';
                body.style.overflow = 'hidden';
            });
        })
        .catch((error) => {
            console.error('Login failed:', error);
            alert('Login failed: ' + error.message);
        });


});

