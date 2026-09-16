import app from './app';
import pool from './config/database';

const PORT = process.env.PORT || 3000;

// Server start করার async function
const startServer = async () => {
  try {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Database connection successful');
      console.log('📅 Current time from DB:', result.rows[0].now);
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }

    // Step 2: Server start করুন
    app.listen(PORT, () => {
      console.log('================================');
      console.log('🚀 Server is running');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Test: http://localhost:${PORT}/`);
      console.log('================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown - Ctrl+C press করলে
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

// Server start করুন
startServer();
