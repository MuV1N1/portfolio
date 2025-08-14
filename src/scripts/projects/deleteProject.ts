import { firebaseClient } from "../services/firebaseClient";
import { DomClient } from "../services/domClient";
import { customConfirm } from "../utils/dialog";

const dom = new DomClient();

function removeCard(card: HTMLElement) {
  console.log('Removing card:', card);
  
  card.style.transition = 'opacity 300ms ease, transform 300ms ease';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.95)';
  
  const onEnd = () => {
    console.log('Transition ended, removing from DOM');
    card.removeEventListener('transitionend', onEnd);
    if (card.parentElement) {
      card.parentElement.removeChild(card);
    }
  };
  
  card.addEventListener('transitionend', onEnd);
  
  setTimeout(() => {
    if (card.parentElement) {
      console.log('Fallback removal triggered');
      card.removeEventListener('transitionend', onEnd);
      card.parentElement.removeChild(card);
    }
  }, 400);
}
function initDelete() {
  const grid = dom.getDivElement(document, 'portfolio-grid');
  if (!grid) {
    throw new Error('Portfolio grid not found');
  }

  grid.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement | null;
    const btn = target?.closest('.delete-project-btn') as HTMLElement | null;
    if (!btn) return;

    if (!firebaseClient.isAuthenticated) {
      alert('Bitte zuerst einloggen.');
      return;
    }

    const projectId = btn.getAttribute('data-id');
    if (!projectId) return;

    const confirmed = await customConfirm({
      title: 'Projekt löschen',
      message: 'Sind Sie sicher, dass Sie dieses Projekt löschen möchten? Dies kann nicht rückgängig gemacht werden.',
      confirmText: 'Löschen',
      cancelText: 'Abbrechen'
    });
    if (!confirmed) return;

    try {
      await firebaseClient.delete('projects', projectId);
      const card = btn.closest('.portfolio-item') as HTMLElement | null;
      console.log('Delete button:', btn);
      console.log('Found card:', card);
      console.log('Card classes:', card?.className);
      if (card) {
        removeCard(card);
      } else {
        console.error('Could not find portfolio item card for deletion');
      }
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
