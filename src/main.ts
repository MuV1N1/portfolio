import './scripts/themeSwitch.ts';
import fetchProjects from './scripts/projects/fetchProjects.ts';
import initEdit from './scripts/projects/editProject.ts';
import initLoginWithDom from './scripts/login.ts';
import initDeleteWithDom from './scripts/projects/deleteProject.ts';
import initCreateProjectWithDom from './scripts/projects/createProject.ts';

initLoginWithDom();
fetchProjects();
initDeleteWithDom();
initEdit();
initCreateProjectWithDom();

