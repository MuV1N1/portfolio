import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

const grid = document.getElementById('portfolio-grid') as HTMLDivElement | null;

if (grid) {
  grid.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('delete-project-btn')) return;

    const projectId = target.getAttribute('data-id');
    if (!projectId) return;

    const confirmDelete = confirm('Sind Sie sicher, dass Sie dieses Projekt löschen möchten? Dies kann nicht rückgängig gemacht werden.');
    if (!confirmDelete) return;

    try {
      await pb.collection('projects').delete(projectId);
      const card = target.closest('.portfolio-item');
      if (card && card.parentElement) {
        card.parentElement.removeChild(card);
      }
      alert('Projekt erfolgreich gelöscht.');
    } catch (error) {
      console.error('Fehler beim Löschen des Projekts:', error);
      alert('Fehler beim Löschen des Projekts. Bitte versuchen Sie es erneut.');
    }
  });
}