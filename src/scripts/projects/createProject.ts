import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');
const createProjectButton = document.getElementById('create-project-btn') as HTMLButtonElement;
const modal = document.getElementById('create-project-modal') as HTMLDivElement;
const closeBtn = document.querySelector('.close-modal') as HTMLSpanElement;
const createProjectForm = document.getElementById('create-project-form') as HTMLFormElement
const body = document.querySelector('body') as HTMLBodyElement;

const portfolioGrid = document.getElementById('portfolio-grid') as HTMLDivElement | null;
function appendProjectCard(project: any) {
    if (!portfolioGrid) return;
    const nameHtml = project?.liveDemoUrl
        ? `<a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer">${project.name}</a>`
        : project.name;
    const sourceHtml = project?.sourceCodeUrl
        ? `<a href="${project.sourceCodeUrl}" target="_blank" rel="noopener noreferrer">Source code</a>`
        : 'Kein Source Code';

    const wrapper = document.createElement('div');
    wrapper.className = 'portfolio-item animate-zoom-in';
    wrapper.style.animationDelay = '0s';
    wrapper.style.visibility = 'visible';
    wrapper.innerHTML = `
          <h3>${nameHtml}</h3>
          <p>${project?.description ?? ''}</p>
          <div class="portfolio-footer">
            <hr>
            ${sourceHtml}
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
            appendProjectCard(record);
        })
        .catch((error) => {
            console.error('Error creating project:', error);
            alert('Error creating project: ' + error.message);
        });
});