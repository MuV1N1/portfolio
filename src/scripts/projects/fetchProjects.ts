import PocketBase from 'pocketbase';
const pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');

const portfolioGrid = (document.getElementById('portfolio-grid') as HTMLDivElement) || (document.querySelector('.portfolio-grid') as HTMLDivElement);

const projects = await pb.collection('projects').getFullList({});
const isAuthenticated = (typeof localStorage !== 'undefined') && localStorage.getItem('isAuthenticated') === 'true';

function applyStagger(container: HTMLDivElement) {
  const items = container.querySelectorAll('.portfolio-item');
  items.forEach((el, i) => {
    (el as HTMLElement).style.animationDelay = `${i * 0.3}s`;
  });
}

export default function fetchProjects() {
  projects.forEach((project) => {
    const projectName = project.liveDemoUrl ? '<a href="' + project.liveDemoUrl + '" target="_blank" rel="noopener noreferrer">' + project.name + '</a>' : project.name;
    const projectDescription = project.description;
    const projectSourceCode = project.sourceCodeUrl
      ? '<a href="' + project.sourceCodeUrl + '" target="_blank" rel="noopener noreferrer">Source code</a>'
      : '<span class="no-source">Kein Source Code</span>';
    const deleteBtn = isAuthenticated ? '<button class="delete-project-btn" data-id="' + project.id + '">🗑️</button>' : '';
    const editBtn = isAuthenticated ? '<button class="edit-project-btn" data-id="' + project.id + '">✏️</button>' : '';

    portfolioGrid.innerHTML += /*html*/ `
         <div class="portfolio-item animate-zoom-in">
          <h3>${projectName}</h3>
          <p>${projectDescription}</p>
          <div class="portfolio-footer">
            <div class="footer-left">${projectSourceCode}</div>
            <div class="footer-right">${editBtn}${deleteBtn}</div>
          </div>
        </div>
    `
  });

  applyStagger(portfolioGrid);
}
fetchProjects();