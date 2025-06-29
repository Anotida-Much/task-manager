import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST;
if (!host) throw new Error('DB_HOST env variable is required');
const port = process.env.DB_PORT;
if (!port) throw new Error('DB_PORT env variable is required');
const database = process.env.DB_NAME;
if (!database) throw new Error('DB_NAME env variable is required');
const user = process.env.DB_USER;
if (!user) throw new Error('DB_USER env variable is required');
const password = process.env.DB_PASSWORD;
if (!password) throw new Error('DB_PASSWORD env variable is required');

const pool = new Pool({
  host: host,
  port: parseInt(port),
  database: database,
  user: user,
  password: password,
  max: 20,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

export const getClient = (): Promise<PoolClient> => {
  return pool.connect();
};

export default pool; 