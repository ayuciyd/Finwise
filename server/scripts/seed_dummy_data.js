require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const seedDummyData = async () => {
  try {
    const userRes = await pool.query('SELECT id, email FROM users WHERE is_verified = true LIMIT 1');
    if (userRes.rows.length === 0) {
      console.log('No verified users found in the database. Please sign up and verify an account first.');
      process.exit(1);
    }
    const userId = userRes.rows[0].id;
    const email = userRes.rows[0].email;

    console.log('Seeding dummy data for user:', email);

    // 1. Create Categories
    const categories = [
      { name: 'Groceries', allocated: 8000, color: '#10B981' },
      { name: 'Rent', allocated: 15000, color: '#3B82F6' },
      { name: 'Transport', allocated: 4000, color: '#F59E0B' },
      { name: 'Entertainment', allocated: 5000, color: '#8B5CF6' }
    ];

    const catMap = {};
    for (const c of categories) {
      const res = await pool.query(
        'INSERT INTO categories (user_id, name, allocated_amount, color) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, c.name, c.allocated, c.color]
      );
      catMap[c.name] = res.rows[0].id;
    }

    // 2. Create Transactions
    const today = new Date();
    const txs = [
      { cat: 'Groceries', amount: 1500, type: 'expense', note: 'Supermarket', daysAgo: 1 },
      { cat: 'Groceries', amount: 800, type: 'expense', note: 'Vegetables', daysAgo: 3 },
      { cat: 'Rent', amount: 15000, type: 'expense', note: 'Monthly Rent', daysAgo: 5 },
      { cat: 'Transport', amount: 500, type: 'expense', note: 'Uber', daysAgo: 2 },
      { cat: 'Transport', amount: 1000, type: 'expense', note: 'Gas', daysAgo: 6 },
      { cat: 'Entertainment', amount: 1200, type: 'expense', note: 'Movie Tickets', daysAgo: 4 },
      { cat: null, amount: 60000, type: 'income', note: 'Salary', daysAgo: 10 },
      { cat: null, amount: 5000, type: 'income', note: 'Freelance', daysAgo: 7 }
    ];

    for (const tx of txs) {
      const d = new Date(today);
      d.setDate(d.getDate() - tx.daysAgo);
      await pool.query(
        'INSERT INTO transactions (user_id, category_id, amount, type, note, date) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, tx.cat ? catMap[tx.cat] : null, tx.amount, tx.type, tx.note, d.toISOString().split('T')[0]]
      );
    }

    // 3. Create Goals
    await pool.query(
      'INSERT INTO goals (user_id, name, target_amount, saved_amount) VALUES ($1, $2, $3, $4)',
      [userId, 'Macbook Pro', 120000, 45000]
    );
    await pool.query(
      'INSERT INTO goals (user_id, name, target_amount, saved_amount) VALUES ($1, $2, $3, $4)',
      [userId, 'Goa Trip', 25000, 8000]
    );

    // 4. Update Savings
    await pool.query('UPDATE savings SET current_amount = 35000 WHERE user_id = $1 AND type = $2', [userId, 'emergency']);
    await pool.query('UPDATE savings SET current_amount = 12000 WHERE user_id = $1 AND type = $2', [userId, 'monthly']);

    console.log('✅ Dummy data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDummyData();
