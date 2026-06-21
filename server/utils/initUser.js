const db = require('../db');

async function initializeUserData(userId) {
  try {
    console.log(`Initializing clean default data for user ID: ${userId}`);
    
    // 1. Insert default categories with 0 allocated amounts
    const categories = [
      { name: 'Groceries', allocated: 0, color: '#10B981' },
      { name: 'Rent', allocated: 0, color: '#3B82F6' },
      { name: 'Transport', allocated: 0, color: '#F59E0B' },
      { name: 'Entertainment', allocated: 0, color: '#8B5CF6' }
    ];

    for (const c of categories) {
      await db.query(
        'INSERT INTO categories (user_id, name, allocated_amount, color) VALUES ($1, $2, $3, $4)',
        [userId, c.name, c.allocated, c.color]
      );
    }

    // 2. Insert default savings records with 0 current and target amounts
    await db.query(
      `INSERT INTO savings (user_id, type, current_amount, target_amount) VALUES ($1, 'emergency', 0, 0)`,
      [userId]
    );
    await db.query(
      `INSERT INTO savings (user_id, type, current_amount, target_amount) VALUES ($1, 'monthly', 0, 0)`,
      [userId]
    );

    // 3. No default goals or transactions are created to ensure a clean slate

    console.log(`✅ Clean default data initialized successfully for user ID: ${userId}`);
  } catch (err) {
    console.error(`Failed to initialize default data for user ID: ${userId}`, err);
  }
}

module.exports = { initializeUserData };
