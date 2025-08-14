import { firebaseClient } from '../services/firebaseClient.ts';
import type { Project } from '../interfaces/project.ts';

export function renderProjectCard(project: Project): string {
  const isAuthenticated = firebaseClient.isAuthenticated;
  
  const projectName = project.liveDemoUrl
    ? `<a class="" href="${project.liveDemoUrl}" target="_blank">${project.name}</a>`
    : project.name ?? '';

  const projectDescription = project.description;

  const projectSourceCode = project.sourceCodeUrl
    ? `<a href="${project.sourceCodeUrl}" target="_blank">Source code</a>`
    : `<span class="no-source">Kein Source Code</span>`;

  const deleteBtn = isAuthenticated
    ? `<button class="delete-project-btn" data-id="${project.id}">🗑️</button>`
    : '';

  const editBtn = isAuthenticated
    ? `<button class="edit-project-btn" data-id="${project.id}">✏️</button>`
    : '';

  return /*html*/ `
    <div class="portfolio-item animate-zoom-in">
      <h3>${projectName}</h3>
      <p>${projectDescription}</p>
      <div class="portfolio-footer">
        <div class="footer-left">${projectSourceCode}</div>
        <div class="footer-right">${editBtn}${deleteBtn}</div>
      </div>
    </div>
  `;
}

export function createProjectElement(project: Project): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'portfolio-item animate-zoom-in';
  wrapper.style.animationDelay = '0s';
  wrapper.style.visibility = 'visible';
  
  const isAuthenticated = firebaseClient.isAuthenticated;
  
  const nameHtml = project.liveDemoUrl
    ? `<a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer">${project.name}</a>`
    : project.name ?? '';
    
  const sourceHtml = project.sourceCodeUrl
    ? `<a href="${project.sourceCodeUrl}" target="_blank" rel="noopener noreferrer">Source code</a>`
    : '<span class="no-source">Kein Source Code</span>';
    
  const deleteBtn = isAuthenticated ? `<button class="delete-project-btn" data-id="${project.id}">🗑️</button>` : '';
  const editBtn = isAuthenticated ? `<button class="edit-project-btn" data-id="${project.id}">✏️</button>` : '';

  wrapper.innerHTML = `
    <h3>${nameHtml}</h3>
    <p>${project.description ?? ''}</p>
    <div class="portfolio-footer">
      <div class="footer-left">${sourceHtml}</div>
      <div class="footer-right">${editBtn}${deleteBtn}</div>
    </div>
  `;
  
  return wrapper;
}

export function updateExistingProjectButtons() {
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (!portfolioGrid) return;
  
  const isAuthenticated = firebaseClient.isAuthenticated;
  const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item');
  
  portfolioItems.forEach((item) => {
    const footerRight = item.querySelector('.footer-right');
    if (!footerRight) return;
    
    const existingBtn = item.querySelector('.delete-project-btn, .edit-project-btn') as HTMLButtonElement;
    const projectId = existingBtn?.getAttribute('data-id');
    
    if (!projectId) return;
    
    // Update the footer-right content based on authentication state
    const deleteBtn = isAuthenticated
      ? `<button class="delete-project-btn" data-id="${projectId}">🗑️</button>`
      : '';
    
    const editBtn = isAuthenticated
      ? `<button class="edit-project-btn" data-id="${projectId}">✏️</button>`
      : '';
    
    footerRight.innerHTML = `${editBtn}${deleteBtn}`;
  });
}
