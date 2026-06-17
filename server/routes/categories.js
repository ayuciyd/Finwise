const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.use(authenticate);

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories WHERE user_id = $1 ORDER BY created_at ASC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/categories
router.post('/', [
  body('name').notEmpty(),
  body('allocated_amount').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, allocated_amount, color } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO categories (user_id, name, allocated_amount, color) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, name, allocated_amount, color || '#1B5E3B']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  const { name, allocated_amount, color } = req.body;
  try {
    const result = await db.query(
      'UPDATE categories SET name = COALESCE($1, name), allocated_amount = COALESCE($2, allocated_amount), color = COALESCE($3, color) WHERE id = $4 AND user_id = $5 RETURNING *',
      [name, allocated_amount, color, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
