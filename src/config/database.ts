import { Pool } from 'pg';
import config from './config';

const pool = new Pool(
  config.DATABASE_URL
    ? {
        connectionString: config.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: config.DB_HOST,
        port: Number(config.DB_PORT),
        database: config.DB_NAME,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

pool.on('connect', () => {
  console.log('connected to database');
});

pool.on('error', (err) => {
  console.log('error connecting to database', err);
});

export default pool;
