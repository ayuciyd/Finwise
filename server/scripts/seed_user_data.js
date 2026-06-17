require('dotenv').config();
const db = require('../db');

const email = 'yadavayushi1439@gmail.com';

async function seed() {
  console.log(`Seeding dummy data for user: ${email}...`);
  try {
    // 1. Fetch User ID
    const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      console.error(`Error: User with email ${email} not found! Please register/signup the user first.`);
      process.exit(1);
    }
    const userId = userRes.rows[0].id;

    // 2. Clear existing data to avoid duplicate or mixed data
    console.log('Cleaning up existing transactions, categories, savings, and goals for this user...');
    await db.query('DELETE FROM transactions WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM categories WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM goals WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM savings WHERE user_id = $1', [userId]);

    // 3. Create Categories
    console.log('Creating standard categories...');
    const categories = [
      { name: 'Rent', allocated_amount: 15000, color: '#3B82F6' },
      { name: 'Groceries', allocated_amount: 8000, color: '#10B981' },
      { name: 'Transport', allocated_amount: 3000, color: '#F59E0B' },
      { name: 'Entertainment', allocated_amount: 4000, color: '#8B5CF6' },
      { name: 'Dining Out', allocated_amount: 5000, color: '#EC4899' },
      { name: 'Utilities', allocated_amount: 6000, color: '#14B8A6' }
    ];

    const catMap = {};
    for (const cat of categories) {
      const res = await db.query(
        'INSERT INTO categories (user_id, name, allocated_amount, color) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, cat.name, cat.allocated_amount, cat.color]
      );
      catMap[cat.name] = res.rows[0].id;
    }

    // 4. Create Goals
    console.log('Creating savings goals...');
    await db.query(
      `INSERT INTO goals (user_id, name, target_amount, saved_amount, target_url, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'Macbook Air M3', 110000, 35000, 'https://www.apple.com/in/macbook-air/', null]
    );
    await db.query(
      `INSERT INTO goals (user_id, name, target_amount, saved_amount, target_url, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'Summer Vacation to Goa', 30000, 12000, 'https://www.goatourism.gov.in/', null]
    );

    // 5. Update Core Savings
    console.log('Inserting core savings values...');
    await db.query(
      `INSERT INTO savings (user_id, type, current_amount, target_amount) 
       VALUES ($1, 'emergency', 45000, 100000)`,
      [userId]
    );
    await db.query(
      `INSERT INTO savings (user_id, type, current_amount, target_amount) 
       VALUES ($1, 'monthly', 15000, 30000)`,
      [userId]
    );

    // 6. Generate Transactions for past 2 months (May 2026 and June 2026)
    console.log('Generating transaction records for May and June 2026...');
    const transactions = [];

    // May 2026 Income
    transactions.push({ catName: null, amount: 65000, type: 'income', note: 'Monthly Salary (May)', date: '2026-05-01' });
    transactions.push({ catName: null, amount: 8000, type: 'income', note: 'Freelance Web Design', date: '2026-05-15' });

    // May 2026 Expenses
    transactions.push({ catName: 'Rent', amount: 15000, type: 'expense', note: 'May Rent Payment', date: '2026-05-01' });
    transactions.push({ catName: 'Utilities', amount: 4500, type: 'expense', note: 'Electricity & Wifi bill', date: '2026-05-03' });
    
    // May Grocery runs
    transactions.push({ catName: 'Groceries', amount: 1800, type: 'expense', note: 'Weekly groceries', date: '2026-05-04' });
    transactions.push({ catName: 'Groceries', amount: 2100, type: 'expense', note: 'Supermarket supplies', date: '2026-05-11' });
    transactions.push({ catName: 'Groceries', amount: 1600, type: 'expense', note: 'Dairy and vegetables', date: '2026-05-18' });
    transactions.push({ catName: 'Groceries', amount: 1950, type: 'expense', note: 'Weekly groceries run', date: '2026-05-25' });

    // May Transport
    transactions.push({ catName: 'Transport', amount: 600, type: 'expense', note: 'Gas fill-up', date: '2026-05-05' });
    transactions.push({ catName: 'Transport', amount: 450, type: 'expense', note: 'Uber ride', date: '2026-05-12' });
    transactions.push({ catName: 'Transport', amount: 650, type: 'expense', note: 'Metro transit card', date: '2026-05-19' });
    transactions.push({ catName: 'Transport', amount: 500, type: 'expense', note: 'Auto rickshaw fare', date: '2026-05-26' });

    // May Dining Out
    transactions.push({ catName: 'Dining Out', amount: 1200, type: 'expense', note: 'Pizza dinner with friends', date: '2026-05-08' });
    transactions.push({ catName: 'Dining Out', amount: 800, type: 'expense', note: 'Cafe study session', date: '2026-05-14' });
    transactions.push({ catName: 'Dining Out', amount: 1500, type: 'expense', note: 'Weekend dining out', date: '2026-05-22' });
    transactions.push({ catName: 'Dining Out', amount: 900, type: 'expense', note: 'Lunch burger meal', date: '2026-05-29' });

    // May Entertainment
    transactions.push({ catName: 'Entertainment', amount: 1500, type: 'expense', note: 'Movie tickets & snacks', date: '2026-05-09' });
    transactions.push({ catName: 'Entertainment', amount: 999, type: 'expense', note: 'Streaming subscriptions', date: '2026-05-16' });
    transactions.push({ catName: 'Entertainment', amount: 1100, type: 'expense', note: 'Arcade games session', date: '2026-05-24' });

    // June 2026 Income
    transactions.push({ catName: null, amount: 65000, type: 'income', note: 'Monthly Salary (June)', date: '2026-06-01' });
    transactions.push({ catName: null, amount: 12000, type: 'income', note: 'Freelance React Developer gig', date: '2026-06-15' });

    // June 2026 Expenses
    transactions.push({ catName: 'Rent', amount: 15000, type: 'expense', note: 'June Rent Payment', date: '2026-06-01' });
    transactions.push({ catName: 'Utilities', amount: 5100, type: 'expense', note: 'Electricity & Wifi bills', date: '2026-06-02' });

    // June Grocery runs
    transactions.push({ catName: 'Groceries', amount: 2200, type: 'expense', note: 'Supermarket Groceries', date: '2026-06-03' });
    transactions.push({ catName: 'Groceries', amount: 1450, type: 'expense', note: 'Veggies & supplies', date: '2026-06-10' });
    transactions.push({ catName: 'Groceries', amount: 2500, type: 'expense', note: 'Weekly provisions', date: '2026-06-16' });

    // June Transport
    transactions.push({ catName: 'Transport', amount: 750, type: 'expense', note: 'Gas fill-up', date: '2026-06-04' });
    transactions.push({ catName: 'Transport', amount: 350, type: 'expense', note: 'Cab booking', date: '2026-06-09' });
    transactions.push({ catName: 'Transport', amount: 800, type: 'expense', note: 'Car maintenance fuel', date: '2026-06-14' });

    // June Dining Out
    transactions.push({ catName: 'Dining Out', amount: 1800, type: 'expense', note: 'Sushi dinner date', date: '2026-06-05' });
    transactions.push({ catName: 'Dining Out', amount: 650, type: 'expense', note: 'Coffee runs', date: '2026-06-11' });
    transactions.push({ catName: 'Dining Out', amount: 1400, type: 'expense', note: 'Weekend brunch', date: '2026-06-13' });

    // June Entertainment
    transactions.push({ catName: 'Entertainment', amount: 1200, type: 'expense', note: 'Bowling with friends', date: '2026-06-06' });
    transactions.push({ catName: 'Entertainment', amount: 999, type: 'expense', note: 'Streaming renewals', date: '2026-06-12' });

    // Insert all transactions
    for (const tx of transactions) {
      const categoryId = tx.catName ? catMap[tx.catName] : null;
      await db.query(
        `INSERT INTO transactions (user_id, category_id, amount, type, note, date) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, categoryId, tx.amount, tx.type, tx.note, tx.date]
      );
    }

    console.log(`\n✅ Rich dummy data successfully seeded for ${email}!`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
