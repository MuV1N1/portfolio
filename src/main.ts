import './scripts/themeSwitch.ts';
import fetchProjects from './scripts/projects/fetchProjects.ts';
import initEdit from './scripts/projects/editProject.ts';
import initLoginWithDom from './scripts/login.ts';
import appendProjectCard from './scripts/projects/createProject.ts';
import initDeleteWithDom from './scripts/projects/deleteProject.ts';

initLoginWithDom();
fetchProjects();
appendProjectCard();
initDeleteWithDom();
initEdit();

export function modalState(modal: HTMLElement, body: HTMLElement, state: string) {

    switch (state) {
        case 'open':
            modal.style.display = 'block';
            body.style.overflow = 'hidden';
            break;
        case 'close':
            modal.style.display = 'none';
            body.style.overflow = 'auto';
            break;
        default:
            break;
    }
}