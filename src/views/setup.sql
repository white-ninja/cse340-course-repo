-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Projects (15 total, 5 per organization)
-- ========================================
INSERT INTO project (organization_id, title, description, location, date)
VALUES
-- Organization 1 Projects (BrightFuture Builders)
(1, 'Community Park Cleanup', 'Help us pick up litter, plant flowers, and refresh park benches.', 'Central Park', '2026-04-15'),
(1, 'Youth Center Repair', 'Painting and minor carpentry repairs for the local youth center.', 'Eastside Community Center', '2026-05-10'),
(1, 'Library Book Sorting', 'Organize and catalog newly donated books for the children section.', 'Downtown Public Library', '2026-05-20'),
(1, 'Trail Maintenance', 'Clear fallen branches and fix gravel pathways on the nature trail.', 'Pine Hill Trail', '2026-06-12'),
(1, 'Senior Center Wheelchair Ramp', 'Assist in building an accessible wooden ramp for residents.', 'Sunset Senior Living', '2026-06-25'),

-- Organization 2 Projects (GreenHarvest Growers)
(2, 'Urban Garden Planting', 'Plant spring vegetables and clear out weeds for the community garden.', 'GreenHarvest Lot B', '2026-04-22'),
(2, 'Farmers Market Workshop', 'Educate local families on sustainable home composting and urban growing.', 'Downtown Square', '2026-06-05'),
(2, 'Greenhouse Winterization', 'Help insulate and set up irrigation lines in the community greenhouse.', 'GreenHarvest Lot A', '2026-07-08'),
(2, 'Seed Packet Assembly', 'Sort and package organic seeds for upcoming neighborhood distributions.', 'Community Hall', '2026-07-19'),
(2, 'Compost Pile Turning', 'Turn organic compost bins and monitor moisture levels for optimal decomposition.', 'GreenHarvest Lot B', '2026-08-03'),

-- Organization 3 Projects (UnityServe Volunteers)
(3, 'Food Drive Sorting', 'Sort and box donated non-perishable food items for local families.', 'UnityServe Warehouse', '2026-04-30'),
(3, 'Holiday Meal Prep', 'Prepare hot meals and assemble care packages for individuals experiencing homelessness.', 'UnityServe Kitchen', '2026-05-18'),
(3, 'School Supply Packing', 'Fill backpacks with notebooks, pens, and learning tools for students in need.', 'UnityServe Warehouse', '2026-07-15'),
(3, 'Winter Coat Drive', 'Collect, wash, and organize winter jackets and blankets for the upcoming season.', 'Community Center', '2026-08-10'),
(3, 'Blood Drive Coordination', 'Greet donors, manage registration tables, and serve refreshments.', 'City Health Center', '2026-08-28');