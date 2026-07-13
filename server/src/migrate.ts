import fs from 'fs';
import path from 'path';
import { pool } from './db';

/** Applies migrations/*.sql once each, tracked in _migrations. */
export async function migrate() {
  await pool.query(
    `create table if not exists _migrations (name text primary key, applied_at timestamptz default now())`
  );
  const dir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const { rowCount } = await pool.query(`select 1 from _migrations where name = $1`, [file]);
    if (rowCount) continue;
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    await pool.query('begin');
    try {
      await pool.query(sql);
      await pool.query(`insert into _migrations (name) values ($1)`, [file]);
      await pool.query('commit');
      console.log(`applied ${file}`);
    } catch (e) {
      await pool.query('rollback');
      throw e;
    }
  }
}

if (require.main === module) {
  migrate()
    .then(() => { console.log('migrations complete'); process.exit(0); })
    .catch(e => { console.error(e); process.exit(1); });
}
