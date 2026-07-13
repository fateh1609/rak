import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    'postgres://rakoasis:rakoasis@localhost:5432/rakoasis'
});

export const query = <T extends import('pg').QueryResultRow = any>(text: string, params?: any[]) =>
  pool.query<T>(text, params);
