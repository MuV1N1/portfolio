import { DomClient } from '../services/domClient.ts';
import { addEventListenerToModal, modalState } from '../../utils/modal.ts';
import { firebaseClient } from '../services/firebaseClient.ts';

const dom = new DomClient();

let lastCreated: any = null;

export function setLastCreated(record: any) {
  lastCreated = record;
}

function appendProjectCard() {
  const portfolioGrid = dom.getDivElement(document, 'portfolio-grid');
  if (!portfolioGrid || !lastCreated) return;
  const project = lastCreated;

  const isAuthenticated = firebaseClient.isAuthenticated;
  const nameHtml = project?.liveDemoUrl
    ? `<a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer">${project.name}</a>`
    : project.name ?? '';
  const sourceHtml = project?.sourceCodeUrl
    ? `<a href="${project.sourceCodeUrl}" target="_blank" rel="noopener noreferrer">Source code</a>`
    : '<span class="no-source">Kein Source Code</span>';
  const deleteBtn = isAuthenticated ? `<button class="delete-project-btn" data-id="${project.id}">🗑️</button>` : '';
  const editBtn = isAuthenticated ? `<button class="edit-project-btn" data-id="${project.id}">✏️</button>` : '';

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

function initCreateProject() {
  const createProjectButton = dom.getButtonElement(document, 'create-project-btn');
  const modal = dom.getDivElement(document, 'create-project-modal');
  const closeBtn = dom.getSpanElement(document, '#create-project-modal .close-modal');
  const createProjectForm = dom.getFormElement(document, 'create-project-form');
  const body = dom.getBody(document);

  if (!createProjectButton || !modal || !closeBtn || !createProjectForm || !body) {
    console.warn('[create] Required DOM nodes missing', {
      hasBtn: !!createProjectButton,
      hasModal: !!modal,
      hasClose: !!closeBtn,
      hasForm: !!createProjectForm,
      hasBody: !!body,
    });
    return;
  }

  // Hide initially; show when auth state is known and on subsequent changes
  createProjectButton.style.display = 'none';
  firebaseClient.ready.then(() => {
    createProjectButton.style.display = firebaseClient.isAuthenticated ? 'block' : 'none';
  });
  firebaseClient.onAuthChange((authed) => {
    createProjectButton.style.display = authed ? 'block' : 'none';
  });

  createProjectButton.addEventListener('click', () => {
    modalState(modal, body, 'open');
  });

  closeBtn.addEventListener('click', () => {
    modalState(modal, body, 'close');
  });

  addEventListenerToModal(modal, body);

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
      const record = await firebaseClient.create('projects', data);
      setLastCreated(record);
      modalState(modal, body, 'close');
      createProjectForm.reset();
      appendProjectCard();
    } catch (error: any) {
      console.error('Error creating project:', error);
      alert('Error creating project: ' + (error.message || 'Unknown error'));
    }
  });
}

export default function initCreateProjectWithDom() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCreateProject);
  } else {
    initCreateProject();
  }
}



