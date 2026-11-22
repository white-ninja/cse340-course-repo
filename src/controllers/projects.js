import {
    getUpcomingProjects,
    getProjectDetails,
    createProject
} from '../models/projects.js';
import {
    getAllCategories,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const projectValidation = [
    body('title')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Title is required')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Description is required')
        .bail()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Location is required')
        .bail()
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .bail()
        .isISO8601()
        .withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .bail()
        .isInt({ min: 1 })
        .withMessage('Organization must be a valid integer')
];

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

    const categories = await getCategoriesByProjectId(id);
    const title = `${project.title} Details`;
    res.render('project', { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const categories = await getAllCategories();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations, categories });
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;
    const selectedCategoryIds = req.body.categoryIds || [];
    const categoryIds = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds].flat();
    const validCategoryIds = categoryIds
        .map((categoryId) => String(categoryId))
        .filter((categoryId) => /^\d+$/.test(categoryId));

    try {
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );
        await updateCategoryAssignments(newProjectId, validCategoryIds);

        req.flash(
            'success',
            'New service project created successfully!'
        );
        return res.redirect('/projects');
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash(
            'error',
            'There was an error creating the service project.'
        );
        return res.redirect('/new-project');
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
};
