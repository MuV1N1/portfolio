const toggle = document.getElementById('theme-toggle') as HTMLInputElement;
const darkScheme = window.matchMedia('(prefers-color-scheme: dark)');

if (toggle !== null) {
    if (localStorage.theme === 'light' ||
        (!('theme' in localStorage) && darkScheme.matches)) {
        document.documentElement.classList.add('dark');
        toggle.checked = true;
    }


    toggle.addEventListener('change', (e) => {
        e.preventDefault();
        setTimeout(() => {
            document.documentElement.classList.remove('theme-animating');
        }, 500);
        if (toggle.checked) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';

        }
    });
}