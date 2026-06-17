const db = require('../db');

async function initializeUserData(userId) {
  try {
    console.log(`Initializing default data for user ID: ${userId}`);
    
    // 1. Insert default categories
    const categories = [
      { name: 'Groceries', allocated: 8000, color: '#10B981' },
      { name: 'Rent', allocated: 15000, color: '#3B82F6' },
      { name: 'Transport', allocated: 3000, color: '#F59E0B' },
      { name: 'Entertainment', allocated: 4000, color: '#8B5CF6' }
    ];

    const catMap = {};
    for (const c of categories) {
      const res = await db.query(
        'INSERT INTO categories (user_id, name, allocated_amount, color) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, c.name, c.allocated, c.color]
      );
      catMap[c.name] = res.rows[0].id;
    }

    // 2. Insert default savings records
    await db.query(
      `INSERT INTO savings (user_id, type, current_amount, target_amount) VALUES ($1, 'emergency', 10000, 100000)`,
      [userId]
    );
    await db.query(
      `INSERT INTO savings (user_id, type, current_amount, target_amount) VALUES ($1, 'monthly', 5000, 20000)`,
      [userId]
    );

    // 3. Insert default goals
    await db.query(
      `INSERT INTO goals (user_id, name, target_amount, saved_amount, target_url, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'Macbook Pro', 120000, 30000, 'https://www.apple.com/in/macbook-pro/', null]
    );
    await db.query(
      `INSERT INTO goals (user_id, name, target_amount, saved_amount, target_url, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'Goa Trip', 25000, 5000, 'https://www.goatourism.gov.in/', null]
    );

    // 4. Insert welcoming transactions
    const today = new Date().toISOString().split('T')[0];
    
    // Welcome Income
    await db.query(
      `INSERT INTO transactions (user_id, category_id, amount, type, note, date) 
       VALUES ($1, null, 50000, 'income', 'Monthly Salary / Stipend (Welcome)', $2)`,
      [userId, today]
    );

    // Welcome Expenses
    await db.query(
      `INSERT INTO transactions (user_id, category_id, amount, type, note, date) 
       VALUES ($1, $2, 1500, 'expense', 'Supermarket Groceries (Welcome)', $3)`,
      [userId, catMap['Groceries'], today]
    );
    await db.query(
      `INSERT INTO transactions (user_id, category_id, amount, type, note, date) 
       VALUES ($1, $2, 500, 'expense', 'Metro transit pass (Welcome)', $3)`,
      [userId, catMap['Transport'], today]
    );

    console.log(`✅ Default data initialized successfully for user ID: ${userId}`);
  } catch (err) {
    console.error(`Failed to initialize default data for user ID: ${userId}`, err);
  }
}

module.exports = { initializeUserData };
