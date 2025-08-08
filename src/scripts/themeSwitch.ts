function applyInitialTheme() {
  try {
    const theme = localStorage.theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('Current theme:', theme, 'Prefers dark:', prefersDark);
    if (theme !== 'dark' || (!theme && prefersDark)) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      const toggle = document.getElementById('theme-toggle') as HTMLInputElement;
      if (toggle) toggle.checked = false;
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      const toggle = document.getElementById('theme-toggle') as HTMLInputElement;
      if (toggle) toggle.checked = true;
    }
  } catch (e) {}
}

applyInitialTheme();

const toggle = document.getElementById('theme-toggle') as HTMLInputElement;
if (toggle) {
  toggle.addEventListener('change', () => {
    if (!toggle.checked) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  });
}