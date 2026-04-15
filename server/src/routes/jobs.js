const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes in this file require the user to be logged in
router.use(authMiddleware);

// GET /api/jobs
// Get all jobs for the logged-in user
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

// POST /api/jobs
// Add a new job application
router.post('/', async (req, res) => {
  const { company, position, status, notes, applied_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO jobs (user_id, company, position, status, notes, applied_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, company, position, status || 'applied', notes, applied_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add job.' });
  }
});

// PUT /api/jobs/:id
// Update an existing job application
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { company, position, status, notes, applied_date } = req.body;

  try {
    // Make sure the job belongs to the logged-in user before updating
    const result = await pool.query(
      `UPDATE jobs
       SET company = $1, position = $2, status = $3, notes = $4, applied_date = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [company, position, status, notes, applied_date, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job.' });
  }
});

// DELETE /api/jobs/:id
// Delete a job application
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Make sure the job belongs to the logged-in user before deleting
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    res.json({ message: 'Job deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job.' });
  }
});

module.exports = router;
