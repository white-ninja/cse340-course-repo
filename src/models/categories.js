import db from './db.js'; // Database import command

export async function getAllCategories() {
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
}