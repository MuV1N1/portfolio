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

export function addEventListenerToModal(modal: HTMLElement, body: HTMLBodyElement) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modalState(modal, body, 'close');
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      modalState(modal, body, 'close');
    }
  });
}