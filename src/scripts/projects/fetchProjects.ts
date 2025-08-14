import { firebaseClient } from "../services/firebaseClient";
import { DomClient } from "../services/domClient";
import type { Project } from "../interfaces/project";
import { renderProjectCard } from "../utils/projectRenderer";
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

    const projects: Project[] = await firebaseClient.getFullList('projects');

    let html = '';
    projects.forEach((project) => {
      html += renderProjectCard(project);
    });

    portfolioGrid.innerHTML = html;
    applyAnimationDelay(portfolioGrid);

  } catch (error) {
    console.error("Fehler beim Laden der Projekte:", error);
  }
}

