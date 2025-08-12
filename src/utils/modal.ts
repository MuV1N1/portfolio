export function modalState(modal: HTMLElement, body: HTMLElement, state: 'open' | 'close') {
  switch (state) {
    case 'open':
      modal.style.display = 'block';
      body.style.overflow = 'hidden';
      break;
    case 'close':
      modal.style.display = 'none';
      body.style.overflow = 'auto';
      break;
  }
}
