import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

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
        const projectSourceCode = project.sourceCodeUrl ? '<a href="' + project.sourceCodeUrl + '" target="_blank" rel="noopener noreferrer">Source code</a>' : 'Kein Source Code';
        const deleteBtn = isAuthenticated ? '<button class="delete-project-btn" data-id="' + project.id + '">🗑️</button>' : '';

        portfolioGrid.innerHTML += /*html*/ `
         <div class="portfolio-item animate-zoom-in">
          <h3>${projectName}</h3>
          <p>${projectDescription}</p>
          <div class="portfolio-footer">
            <hr>
            ${projectSourceCode} ${deleteBtn}
          </div>
        </div>
    `
    });

    // Apply staggered animation delays after rendering
    applyStagger(portfolioGrid);
}
fetchProjects();