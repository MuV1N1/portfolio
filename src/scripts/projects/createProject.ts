import PocketBase from 'pocketbase';
import { modalState } from '../../utils/modal.ts';
const pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');
const createProjectButton = document.getElementById('create-project-btn') as HTMLButtonElement;
const modal = document.getElementById('create-project-modal') as HTMLDivElement;
const closeBtn = document.querySelector('#create-project-modal .close-modal') as HTMLSpanElement;
const createProjectForm = document.getElementById('create-project-form') as HTMLFormElement;
const body = document.querySelector('body') as HTMLBodyElement;

const portfolioGrid = document.getElementById('portfolio-grid') as HTMLDivElement | null;
const isAuthenticated = pb.authStore.isValid;

let lastCreated: any = null;

export function setLastCreated(record: any) {
  lastCreated = record;
}

export default async function appendProjectCard() {
  if (!portfolioGrid || !lastCreated) return;
  const project = lastCreated;

  const nameHtml = project?.liveDemoUrl
    ? `<a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer">${project.name}</a>`
    : project.name ?? '';
  const sourceHtml = project?.sourceCodeUrl
    ? `<a href="${project.sourceCodeUrl}" target="_blank" rel="noopener noreferrer">Source code</a>`
    : '<span class="no-source">Kein Source Code</span>';
  const deleteBtn = isAuthenticated ? `<button class=\"delete-project-btn\" data-id=\"${project.id}\">🗑️</button>` : '';
  const editBtn = isAuthenticated ? `<button class=\"edit-project-btn\" data-id=\"${project.id}\">✏️</button>` : '';

  const wrapper = document.createElement('div');
  wrapper.className = 'portfolio-item animate-zoom-in';
  wrapper.style.animationDelay = '0s';
  wrapper.style.visibility = 'visible';
  wrapper.innerHTML = `
        <h3>${nameHtml}</h3>
        <p>${project?.description ?? ''}</p>
        <div class="portfolio-footer">
          <div class="footer-left">${sourceHtml}</div>
          <div class="footer-right">${editBtn}${deleteBtn}</div>
        </div>
      `;
  portfolioGrid.appendChild(wrapper);
}

if (!pb.authStore.isValid) {
  createProjectButton.style.display = 'none';
} else {
  createProjectButton.style.display = 'block';
}

createProjectButton.addEventListener('click', () => {
  modalState(modal, body, 'open');
});

closeBtn.addEventListener('click', () => {
  modalState(modal, body, 'close');
});
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modalState(modal, body, 'close');
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    modalState(modal, body, 'close');
  }
});
createProjectForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(createProjectForm);
  const projectName = formData.get('project-name')?.toString().trim() || '';
  const projectDescription = formData.get('project-description')?.toString().trim() || '';
  const projectLiveDemo = formData.get('project-url')?.toString().trim() || '';
  const projectSourceCode = formData.get('project-source-code-url')?.toString().trim() || '';

  if (!projectName || !projectDescription) {
    alert('Please fill in at least the name and description.');
    return;
  }

  const data = {
    name: projectName,
    description: projectDescription,
    liveDemoUrl: projectLiveDemo || null,
    sourceCodeUrl: projectSourceCode || null,
  };

  try {
    const record = await pb.collection('projects').create(data);
    console.log('Project created successfully:', record);
    setLastCreated(record);
    closeModalAndResetForm();
    appendProjectCard();
  } catch (error: any) {
    console.error('Error creating project:', error);
    alert('Error creating project: ' + (error.message || 'Unknown error'));
  }
});

function closeModalAndResetForm() {
  modalState(modal, body, 'close');
  createProjectForm.reset();
}



