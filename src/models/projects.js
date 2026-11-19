import db from './db.js';

export const getAllProjects = async () => {
    try {
        const query = `
            SELECT p.project_id, p.title, p.description, p.location, p.date, o.name AS organization_name
            FROM project p
            JOIN organization o ON p.organization_id = o.organization_id
            ORDER BY p.date ASC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};