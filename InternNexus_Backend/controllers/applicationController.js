import pool from "../config/db.js";

// POST /api/applications/apply
// Student applies to an internship
export const applyToInternship = async (req, res) => {
  try {
    const { internship_id } = req.body;
    const student_id = req.user.id;

    // Check if already applied
    const existing = await pool.query(
      "SELECT * FROM applications WHERE student_id = $1 AND internship_id = $2",
      [student_id, internship_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Already applied to this internship" });
    }

    const result = await pool.query(
      `INSERT INTO applications (student_id, internship_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [student_id, internship_id]
    );

    res.status(201).json({ application: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/applications/student
// Student sees their own applications
export const getStudentApplications = async (req, res) => {
  try {
    const student_id = req.user.id;

    const result = await pool.query(
      `SELECT 
        applications.id,
        applications.internship_id, 
        applications.status,
        applications.applied_at,
        internships.title,
        internships.location,
        internships.stipend,
        users.name AS company_name
       FROM applications
       JOIN internships ON applications.internship_id = internships.id
       JOIN users ON internships.company_id = users.id
       WHERE applications.student_id = $1
       ORDER BY applications.applied_at DESC`,
      [student_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/applications/company
// Company sees all applicants for their internships
export const getCompanyApplications = async (req, res) => {
  try {
    const company_id = req.user.id;

    const result = await pool.query(
      `SELECT 
        applications.id,
        applications.status,
        applications.applied_at,
        internships.title,
        users.name AS student_name,
        users.email AS student_email
       FROM applications
       JOIN internships ON applications.internship_id = internships.id
       JOIN users ON applications.student_id = users.id
       WHERE internships.company_id = $1
       ORDER BY applications.applied_at DESC`,
      [company_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/applications/:id/status
// Company accepts or rejects an application
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const company_id = req.user.id;

    // Validate status value
    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Make sure this application belongs to the company's internship
    const result = await pool.query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       AND internship_id IN (
         SELECT id FROM internships WHERE company_id = $3
       )
       RETURNING *`,
      [status, id, company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found or unauthorized" });
    }

    res.json({ message: `Application ${status}`, application: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const student_id = req.user.id;

    const result = await pool.query(
      `DELETE FROM applications 
       WHERE id = $1 AND student_id = $2
       RETURNING *`,
      [id, student_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found or unauthorized" });
    }

    res.json({ message: "Application withdrawn successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};