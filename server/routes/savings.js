const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/savings
// Initializes default savings objects if they don't exist
router.get('/', async (req, res) => {
  try {
    let result = await db.query('SELECT * FROM savings WHERE user_id = $1', [req.user.id]);
    
    // If not exists, create defaults
    if (result.rows.length === 0) {
      await db.query(
        'INSERT INTO savings (user_id, type) VALUES ($1, $2), ($1, $3)',
        [req.user.id, 'emergency', 'monthly']
      );
      result = await db.query('SELECT * FROM savings WHERE user_id = $1', [req.user.id]);
    }
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/savings/:type
router.put('/:type', async (req, res) => {
  const { type } = req.params;
  if (!['emergency', 'monthly'].includes(type)) {
    return res.status(400).json({ error: 'Invalid savings type' });
  }

  const { target_amount, current_amount } = req.body;
  try {
    const result = await db.query(
      'UPDATE savings SET target_amount = COALESCE($1, target_amount), current_amount = COALESCE($2, current_amount), updated_at = NOW() WHERE type = $3 AND user_id = $4 RETURNING *',
      [target_amount, current_amount, type, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
