import { Pool, PoolClient, QueryResultRow } from "pg";
import { bootstrap } from "./bootstrap";

const g = globalThis as unknown as { __pool?: Pool; __ready?: Promise<void> | null };

const pool: Pool =
  g.__pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    // Hosted Postgres (Neon, Render, Supabase...) needs TLS; local does not.
    ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? "") ? undefined : { rejectUnauthorized: false },
  });
g.__pool = pool;

/** Makes sure tables exist (and demo data is loaded) before the first query. */
function ensureReady(): Promise<void> {
  if (!g.__ready) {
    g.__ready = bootstrap(pool).catch((e) => {
      g.__ready = null; // allow a retry on the next request
      throw e;
    });
  }
  return g.__ready;
}

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureReady();
  const res = await pool.query<T>(text, params);
  return res.rows;
}

export async function getClient(): Promise<PoolClient> {
  await ensureReady();
  return pool.connect();
}
