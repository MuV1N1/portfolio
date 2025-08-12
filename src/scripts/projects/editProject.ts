import PocketBase from 'pocketbase';
import { modalState } from '../../main';
const pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');

const body = document.querySelector('body') as HTMLBodyElement;
const modal = document.getElementById('edit-project-modal') as HTMLDivElement | null;
const form = document.getElementById('edit-project-form') as HTMLFormElement | null;
const nameInput = document.getElementById('edit-project-name') as HTMLInputElement | null;
const descriptionInput = document.getElementById('edit-project-description') as HTMLTextAreaElement | null;
const liveDemoUrlInput = document.getElementById('edit-project-url') as HTMLInputElement | null;
const sourceCodeUrlInput = document.getElementById('edit-project-source-code-url') as HTMLInputElement | null;

const grid = document.getElementById('portfolio-grid') as HTMLDivElement | null;
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

  const card = target.closest('.portfolio-item') as HTMLElement | null;
  const projectId = target.getAttribute('data-id');
  if (!projectId || !card) return;

  currentProjectId = projectId;
  currentCardEl = card;

  try {
    const record = await pb.collection('projects').getOne(projectId);
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
  window.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
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
      const updated = await pb.collection('projects').update(currentProjectId, data);
      if (currentCardEl) updateCardDom(currentCardEl, data);
      closeModal();
      console.log('Projekt aktualisiert:', updated);
    } catch (err: any) {
      console.error('Update fehlgeschlagen:', err);
      alert('Update fehlgeschlagen: ' + (err?.message ?? 'Unbekannter Fehler'));
    }
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

