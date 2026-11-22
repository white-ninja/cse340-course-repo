import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = req.params.id;

    if (!/^\d+$/.test(categoryId)) {
        const err = new Error('Invalid category ID');
        err.status = 400;
        return next(err);
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';

    res.render('category', { title, category, projects });
};

const showAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.projectId;

    if (!/^\d+$/.test(projectId)) {
        const err = new Error('Invalid project ID');
        err.status = 400;
        return next(err);
    }

    const projectDetails = await getProjectDetails(projectId);
    if (!projectDetails) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    const categoryIds = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds].flat();
    const validCategoryIds = categoryIds
        .map((categoryId) => String(categoryId))
        .filter((categoryId) => /^\d+$/.test(categoryId));

    await updateCategoryAssignments(projectId, validCategoryIds);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
