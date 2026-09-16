import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('🔄 Starting database migration...\n');

    // Migration files এর path (root থেকে)
    const migrationsDir = path.join(__dirname, 'src', 'database', 'migrations');

    // সব .sql files পড়ুন এবং sort করুন
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort(); // alphabetically sort হবে

    console.log(`📁 Found ${files.length} migration files:\n`);

    // প্রতিটি migration file execute করুন
    for (const file of files) {
      console.log(`  ⏳ Running: ${file}`);

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await client.query(sql);

      console.log(`  ✅ Completed: ${file}\n`);
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migrations
runMigrations();
