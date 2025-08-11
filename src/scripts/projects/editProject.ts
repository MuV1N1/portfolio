import PocketBase from 'pocketbase';
const pb = new PocketBase('https://muv1n-portfolio.pockethost.io/');
const editProjectButton = document.getElementById('edit-project-btn') as HTMLButtonElement;

if (!editProjectButton) {
    console.error('Edit project button not found');
}
if (!localStorage.getItem('isAuthenticated') || localStorage.getItem('isAuthenticated') !== 'true') {
    editProjectButton.style.display = 'none';
}
editProjectButton.addEventListener('click', async () => {
    const projectId = editProjectButton.getAttribute('data-id');
    if (!projectId) {
        console.error('No project ID found for editing');
        return;
    }
    try {
        console.log(projectId);
        const project = await pb.collection('projects').getOne(projectId);
        console.log('Project fetched for editing:', project);
    } catch (error) {
        console.error('Error fetching project for editing:', error);
        return;
    }
});