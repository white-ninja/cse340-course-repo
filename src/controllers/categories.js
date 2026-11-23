import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Category name is required')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';

    res.render('categories', { title, categories });
};

const showNewCategoryForm = (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    try {
        const categoryId = await createCategory(req.body.name);
        req.flash('success', 'Category created successfully!');
        return res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error creating category:', error);
        req.flash('error', 'There was an error creating the category.');
        return res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res, next) => {
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

    const title = 'Edit Category';
    res.render('edit-category', { title, category });
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        await updateCategory(categoryId, req.body.name);
        req.flash('success', 'Category updated successfully!');
        return res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        return res.redirect(`/edit-category/${categoryId}`);
    }
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
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
