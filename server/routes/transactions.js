const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.use(authenticate);

// GET /api/transactions
router.get('/', async (req, res) => {
  const { month, category } = req.query; // month format 'YYYY-MM'
  
  try {
    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    let params = [req.user.id];
    let paramIndex = 2;

    if (month) {
      query += ` AND to_char(date, 'YYYY-MM') = $${paramIndex}`;
      params.push(month);
      paramIndex++;
    }

    if (category) {
      query += ` AND category_id = $${paramIndex}`;
      params.push(category);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/transactions
router.post('/', [
  body('amount').isNumeric(),
  body('type').isIn(['income', 'expense']),
  body('date').isDate()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { category_id, amount, type, note, date } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO transactions (user_id, category_id, amount, type, note, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, category_id || null, amount, type, note, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  const { category_id, amount, type, note, date } = req.body;
  try {
    const result = await db.query(
      'UPDATE transactions SET category_id = COALESCE($1, category_id), amount = COALESCE($2, amount), type = COALESCE($3, type), note = COALESCE($4, note), date = COALESCE($5, date) WHERE id = $6 AND user_id = $7 RETURNING *',
      [category_id, amount, type, note, date, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
