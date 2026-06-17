const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.use(authenticate);

// GET /api/goals
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at ASC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/goals
router.post('/', [
  body('name').notEmpty(),
  body('target_amount').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, target_amount, deadline, target_url, image_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO goals (user_id, name, target_amount, deadline, target_url, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, name, target_amount, deadline || null, target_url || null, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/goals/:id
router.put('/:id', async (req, res) => {
  const { name, target_amount, saved_amount, deadline, target_url, image_url } = req.body;
  
  // Coerce undefined values to null so that COALESCE behaves correctly in postgres
  const nameVal = name !== undefined ? name : null;
  const targetAmtVal = target_amount !== undefined ? target_amount : null;
  const savedAmtVal = saved_amount !== undefined ? saved_amount : null;
  const deadlineVal = deadline !== undefined ? deadline : null;
  const targetUrlVal = target_url !== undefined ? target_url : null;
  const imageUrlVal = image_url !== undefined ? image_url : null;

  try {
    const result = await db.query(
      'UPDATE goals SET name = COALESCE($1, name), target_amount = COALESCE($2, target_amount), saved_amount = COALESCE($3, saved_amount), deadline = COALESCE($4, deadline), target_url = COALESCE($5, target_url), image_url = COALESCE($6, image_url) WHERE id = $7 AND user_id = $8 RETURNING *',
      [nameVal, targetAmtVal, savedAmtVal, deadlineVal, targetUrlVal, imageUrlVal, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/goals/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
