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

