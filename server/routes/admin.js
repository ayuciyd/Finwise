const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

router.use(authenticate);
router.use(adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsersResult = await db.query('SELECT COUNT(*) FROM users');
    const totalTxResult = await db.query('SELECT COUNT(*) FROM transactions');
    const totalMoneyResult = await db.query('SELECT SUM(amount) FROM transactions');

    res.json({
      totalUsers: parseInt(totalUsersResult.rows[0].count),
      totalTransactions: parseInt(totalTxResult.rows[0].count),
      totalMoneyTracked: parseFloat(totalMoneyResult.rows[0].sum) || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, monthly_budget, created_at, is_admin FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own admin account' });
    }
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
