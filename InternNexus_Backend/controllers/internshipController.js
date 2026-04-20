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

// GET /api/internships/search?title=&location=&stipend=
export const searchInternships = async (req, res) => {
  try {
    const { title, location, stipend } = req.query;

    let query = `
      SELECT 
        internships.id,
        internships.title,
        internships.description,
        internships.location,
        internships.stipend,
        internships.posted_at,
        users.name AS company_name
      FROM internships
      JOIN users ON internships.company_id = users.id
      WHERE 1=1
    `;

    const values = [];
    let count = 1;

    if (title) {
      query += ` AND internships.title ILIKE $${count}`;
      values.push(`%${title}%`);
      count++;
    }

    if (location) {
      query += ` AND internships.location ILIKE $${count}`;
      values.push(`%${location}%`);
      count++;
    }

    if (stipend) {
      query += ` AND internships.stipend >= $${count}`;
      values.push(parseInt(stipend));
      count++;
    }

    query += ` ORDER BY posted_at DESC`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/internships/:id
export const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.id;

    const result = await pool.query(
      `DELETE FROM internships 
       WHERE id = $1 AND company_id = $2
       RETURNING *`,
      [id, company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Internship not found or unauthorized" });
    }

    res.json({ message: "Internship deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};