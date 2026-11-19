import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
        const err = new Error('Invalid project ID');
        err.status = 400;
        return next(err);
    }

    const project = await getProjectDetails(id);

    if (!project) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const title = `${project.title} Details`;
    res.render('project', { title, project });
};

export { showProjectsPage, showProjectDetailsPage };
