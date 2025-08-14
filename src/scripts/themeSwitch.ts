const theme: string = localStorage.theme;
const prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
const toggle = document.getElementById('theme-toggle') as HTMLInputElement;

if (!toggle) {
  throw new Error('Theme toggle input not found');
}

function editClassList(document: Document, className: string, action: string) {
  switch (action) {
    case 'add':
      document.documentElement.classList.add(className);
      break;
    case 'remove':
      document.documentElement.classList.remove(className);
      break;
    default:
      console.error('Unknown class name:', className);
      break;
  }
}

function changeToggleState(state: boolean) {
  if (toggle) toggle.checked = state;
}

function initial() {
  try {
    if (theme !== 'dark' || (!theme && prefersDark)) {
      editClassList(document, 'light', 'add');
      editClassList(document, 'dark', 'remove');
      changeToggleState(false);
    } else {
      editClassList(document, 'light', 'remove');
      editClassList(document, 'dark', 'add');
      changeToggleState(true);
    }
  } catch (e) {
    console.error('Error applying initial theme:', e);
  }
}

toggle.addEventListener('change', () => {
  if (!toggle.checked) {
    editClassList(document, 'dark', 'remove');
    editClassList(document, 'light', 'add');
    localStorage.theme = 'light';
  } else {
    editClassList(document, 'light', 'remove');
    editClassList(document, 'dark', 'add');
    localStorage.theme = 'dark';
  }
});

initial();
