"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const pool = new pg_1.Pool({
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
        const migrationsDir = path_1.default.join(__dirname, 'src', 'database', 'migrations');
        // সব .sql files পড়ুন এবং sort করুন
        const files = fs_1.default
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith('.sql'))
            .sort(); // alphabetically sort হবে
        console.log(`📁 Found ${files.length} migration files:\n`);
        // প্রতিটি migration file execute করুন
        for (const file of files) {
            console.log(`  ⏳ Running: ${file}`);
            const filePath = path_1.default.join(migrationsDir, file);
            const sql = fs_1.default.readFileSync(filePath, 'utf8');
            await client.query(sql);
            console.log(`  ✅ Completed: ${file}\n`);
        }
        console.log('🎉 All migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
    finally {
        client.release();
        await pool.end();
    }
}
// Run migrations
runMigrations();
//# sourceMappingURL=migrate.js.map