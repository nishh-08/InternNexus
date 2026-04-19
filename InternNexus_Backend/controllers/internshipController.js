import pool from "../config/db.js";

// Create Internship (Company only)
export const createInternship = async (req, res) => {
  try {
    const { title, description, location, stipend } = req.body;

    const newInternship = await pool.query(
      `INSERT INTO internships 
        (company_id, title, description, location, stipend) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.user.id, title, description, location, stipend] // req.user.id from JWT
    );

    res.status(201).json({ internship: newInternship.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all internships WITH company name
export const getAllInternships = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        internships.id,
        internships.title,
        internships.description,
        internships.location,
        internships.stipend,
        internships.posted_at,
        users.name AS company_name

      FROM internships

      JOIN users 
      ON internships.company_id = users.id

      ORDER BY posted_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};