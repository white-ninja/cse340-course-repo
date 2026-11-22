import db from './db.js'; // Database import command

export const getAllCategories = async () => {
    try {
        const query = `
            SELECT category_id, name 
            FROM category 
            ORDER BY name ASC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

export const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC, p.title ASC;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, category_id) DO NOTHING
    `;

    await db.query(query, [categoryId, projectId]);
};

export const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};