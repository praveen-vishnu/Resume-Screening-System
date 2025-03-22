import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
