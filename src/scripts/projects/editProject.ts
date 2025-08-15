import { modalState, addEventListenerToModal } from '../utils/modal.ts';
import { firebaseClient } from '../services/firebaseClient.ts';
import { DomClient } from '../services/domClient.ts';
import { customConfirm } from '../utils/dialog.ts';

const dom = new DomClient();

const body = dom.getBody(document);
const modal = dom.getDivElement(document, 'edit-project-modal');
const form = dom.getFormElement(document, 'edit-project-form');
const nameInput = dom.getInputElement(document, 'edit-project-name');
const descriptionInput = dom.getTextAreaElement(document, 'edit-project-description');
const liveDemoUrlInput = dom.getInputElement(document, 'edit-project-url');
const sourceCodeUrlInput = dom.getInputElement(document, 'edit-project-source-code-url');

const grid = dom.getDivElement(document, 'portfolio-grid');
let currentProjectId: string | null = null;
let currentCardEl: HTMLElement | null = null;

function openModal() {
  if (!modal) return;
  modalState(modal, body, 'open');
}

function closeModal() {
  if (!modal) return;
  modalState(modal, body, 'close');
  currentProjectId = null;
  currentCardEl = null;
}

function updateCardDom(card: HTMLElement, data: { name: string; description: string; liveDemoUrl?: string; sourceCodeUrl?: string; }) {
  const h3 = card.querySelector('h3') as HTMLElement | null;
  if (h3) {
    if (data.liveDemoUrl) {
      h3.innerHTML = `<a href="${data.liveDemoUrl}" target="_blank" rel="noopener noreferrer">${data.name}</a>`;
    } else {
      h3.textContent = data.name;
    }
  }
  const p = card.querySelector('p') as HTMLParagraphElement | null;
  if (p) p.textContent = data.description;
  const footerLeft = card.querySelector('.portfolio-footer .footer-left') as HTMLElement | null;
  if (footerLeft) {
    if (data.sourceCodeUrl) {
      footerLeft.innerHTML = `<a href="${data.sourceCodeUrl}" target="_blank" rel="noopener noreferrer">Source code</a>`;
    } else {
      footerLeft.innerHTML = '<span class="no-source">Kein Source Code</span>';
    }
  }
}

async function handleEditButtonClick(e: Event) {
  const target = e.target as HTMLElement;
  if (!target.classList.contains('edit-project-btn')) return;

  if (!firebaseClient.isAuthenticated || !firebaseClient.isAuthorizedUser()) {
    alert('Bitte zuerst einloggen.');
    return;
  }

  const card = target.closest('.portfolio-item') as HTMLElement | null;
  const projectId = target.getAttribute('data-id');
  if (!projectId || !card) return;

  currentProjectId = projectId;
  currentCardEl = card;

  try {
    const record = await firebaseClient.getOne('projects', projectId);
    if (nameInput) nameInput.value = record.name ?? '';
    if (descriptionInput) descriptionInput.value = record.description ?? '';
    if (liveDemoUrlInput) liveDemoUrlInput.value = record.liveDemoUrl ?? '';
    if (sourceCodeUrlInput) sourceCodeUrlInput.value = record.sourceCodeUrl ?? '';
    openModal();
  } catch (err) {
    console.error('Failed to load project', err);
    alert('Projekt konnte nicht geladen werden.');
  }
}

function wireModalClose() {
  if (!modal) return;
  const closeBtn = modal.querySelector('.close-modal') as HTMLElement | null;
  closeBtn?.addEventListener('click', closeModal);
  addEventListenerToModal(modal, body);

}

function wireFormSubmit() {
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentProjectId) return;

    const data = {
      name: nameInput?.value ?? '',
      description: descriptionInput?.value ?? '',
      liveDemoUrl: liveDemoUrlInput?.value ?? '',
      sourceCodeUrl: sourceCodeUrlInput?.value ?? ''
    } as { name: string; description: string; liveDemoUrl?: string; sourceCodeUrl?: string };


    try {
      const confirmed = await customConfirm({
        title: 'Projekt aktualisieren',
        message: 'Sind Sie sicher, dass Sie dieses Projekt aktualisieren möchten?',
        confirmText: 'Aktualisieren',
        cancelText: 'Abbrechen'
      });
      if (!confirmed) {
        form.reset();
        closeModal();
        return;
      };
      const updated = await firebaseClient.update('projects', currentProjectId, data);
      if (currentCardEl) updateCardDom(currentCardEl, data);
      closeModal();
      console.log('Projekt aktualisiert:', updated);

    } catch (err: any) {
      console.error('Update fehlgeschlagen:', err);
      alert('Update fehlgeschlagen: ' + (err?.message ?? 'Unbekannter Fehler'));
    }
    form.reset();
  });
}

export default function initEdit() {
  wireModalClose();
  wireFormSubmit();
  if (grid) {
    grid.addEventListener('click', handleEditButtonClick);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      const g = document.getElementById('portfolio-grid');
      g?.addEventListener('click', handleEditButtonClick);
    });
  }
}

