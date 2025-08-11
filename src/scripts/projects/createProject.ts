import PocketBase from 'pocketbase';
const pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');
const createProjectButton = document.getElementById('create-project-btn') as HTMLButtonElement;
const modal = document.getElementById('create-project-modal') as HTMLDivElement;
const closeBtn = document.querySelector('#create-project-modal .close-modal') as HTMLSpanElement;
const createProjectForm = document.getElementById('create-project-form') as HTMLFormElement
const body = document.querySelector('body') as HTMLBodyElement;

const portfolioGrid = document.getElementById('portfolio-grid') as HTMLDivElement | null;
const isAuthenticated = (typeof localStorage !== 'undefined') && localStorage.getItem('isAuthenticated') === 'true';
function appendProjectCard(project: any) {
    if (!portfolioGrid) return;
    const nameHtml = project?.liveDemoUrl
        ? `<a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer">${project.name}</a>`
        : project.name;
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

if(localStorage.getItem('isAuthenticated') !== 'true') {
    createProjectButton.style.display = 'none';
} else {
    createProjectButton.style.display = 'block';
}

createProjectButton.addEventListener('click', () => {
    modal.style.display = 'block';
    body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    body.style.overflow = 'auto';
});
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        body.style.overflow = 'auto';
    }
});
createProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectNameInput = document.getElementById('project-name') as HTMLInputElement;
    const projectDescriptionInput = document.getElementById('project-description') as HTMLTextAreaElement;
    const projectLiveDemoInput = document.getElementById('project-url') as HTMLInputElement;
    const projectSourceCodeInput = document.getElementById('project-source-code-url') as HTMLInputElement;

    const projectName = projectNameInput.value;
    const projectDescription = projectDescriptionInput.value;
    const projectLiveDemo = projectLiveDemoInput.value;
    const projectSourceCode = projectSourceCodeInput.value;

    const data = {
        "name": projectName,
        "description": projectDescription,
        "liveDemoUrl": projectLiveDemo,
        "sourceCodeUrl": projectSourceCode
    }

    await pb.collection('projects').create(data)
        .then((record) => {
            console.log('Project created successfully:', record);
            modal.style.display = 'none';
            body.style.overflow = 'auto';
            projectNameInput.value = '';
            projectDescriptionInput.value = '';
            projectLiveDemoInput.value = '';
            projectSourceCodeInput.value = '';
            // immediately render the new card
            appendProjectCard(record);
        })
        .catch((error) => {
            console.error('Error creating project:', error);
            alert('Error creating project: ' + error.message);
        });
});