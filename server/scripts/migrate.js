require('dotenv').config();
const db = require('../db');

async function migrate() {
  console.log('Running schema migrations...');
  try {
    // Add target_url and image_url columns to goals table if they don't exist
    await db.query(`
      ALTER TABLE goals 
      ADD COLUMN IF NOT EXISTS target_url VARCHAR(1024),
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(1024);
    `);
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
