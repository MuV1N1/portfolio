import { PocketBaseClient } from "../../services/pocketbaseClient";

const pb = new PocketBaseClient();

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

function initDelete() {
  const grid = document.getElementById('portfolio-grid') as HTMLDivElement | null;
  if (!grid) {
    console.warn('[delete] portfolio-grid not found');
    return;
  }

  grid.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement | null;
    const btn = target?.closest('.delete-project-btn') as HTMLElement | null;
    if (!btn) return;

    if (!pb.isAuthenticated) {
      alert('Bitte zuerst einloggen.');
      return;
    }

    const projectId = btn.getAttribute('data-id');
    if (!projectId) return;

    const confirmDelete = confirm('Sind Sie sicher, dass Sie dieses Projekt löschen möchten? Dies kann nicht rückgängig gemacht werden.');
    if (!confirmDelete) return;

    try {
      await pb.delete('projects', projectId);
      const card = btn.closest('.portfolio-item') as HTMLElement | null;
      if (card) removeCard(card);
    } catch (error) {
      console.error('Fehler beim Löschen des Projekts:', error);
      alert('Fehler beim Löschen des Projekts. Bitte versuchen Sie es erneut.');
    }
  });
}

export default function initDeleteWithDom() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDelete);
  } else {
    initDelete();
  }

}