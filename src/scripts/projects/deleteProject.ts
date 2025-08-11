import PocketBase from 'pocketbase';
const pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');

const grid = document.getElementById('portfolio-grid') as HTMLDivElement | null;


function removeCard(card: HTMLElement) {
  card.style.transition = 'opacity 180ms ease, transform 180ms ease';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.98)';
  const onEnd = () => {
    card.removeEventListener('transitionend', onEnd);
    card.parentElement?.removeChild(card);
  };
  card.addEventListener('transitionend', onEnd);
}


if (grid && pb.authStore.isValid) {
  grid.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;

    if (!target.classList.contains('delete-project-btn')) return;

    const projectId = target.getAttribute('data-id');
    if (!projectId) return;

    const confirmDelete = confirm('Sind Sie sicher, dass Sie dieses Projekt löschen möchten? Dies kann nicht rückgängig gemacht werden.');
    if (!confirmDelete) return;

    try {
      await pb.collection('projects').delete(projectId);
      const card = target.closest('.portfolio-item') as HTMLElement | null;
      if (card) removeCard(card);
    } catch (error) {
      console.error('Fehler beim Löschen des Projekts:', error);
      alert('Fehler beim Löschen des Projekts. Bitte versuchen Sie es erneut.');
    }
  });
}