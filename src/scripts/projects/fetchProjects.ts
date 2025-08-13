import { FirebaseClient } from "../services/firebaseClient";
import { DomClient } from "../services/domClient";
import type { Project } from "../interfaces/project";
const fb = new FirebaseClient();
const dom = new DomClient();
const portfolioGrid = dom.getDivElement(document, 'portfolio-grid');

function applyAnimationDelay(container: HTMLDivElement) {
  const items = container.querySelectorAll('.portfolio-item');
  items.forEach((el, i) => {
    (el as HTMLElement).style.animationDelay = `${i * 0.3}s`;
  });
}

export default async function fetchProjects() {
  if (!portfolioGrid) return console.error("Portfolio grid not found!");

  try {
    portfolioGrid.innerHTML = '';

    const projects: Project[] = await fb.getFullList('projects');
    const isAuthenticated = fb.isAuthenticated;

    let html = '';

    projects.forEach((project) => {
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

      html += /*html*/ `
        <div class="portfolio-item animate-zoom-in">
          <h3>${projectName}</h3>
          <p>${projectDescription}</p>
          <div class="portfolio-footer">
            <div class="footer-left">${projectSourceCode}</div>
            <div class="footer-right">${editBtn}${deleteBtn}</div>
          </div>
        </div>
      `;
    });

    portfolioGrid.innerHTML = html;
    applyAnimationDelay(portfolioGrid);

  } catch (error) {
    console.error("Fehler beim Laden der Projekte:", error);
  }
}

