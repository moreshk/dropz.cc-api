import process from 'node:process';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function runMigrate() {
  if (!process.env.DB_URL)
    throw new Error('DB_URL is not defined');

  const connection = postgres(process.env.DB_URL);

  const db = drizzle(connection);

  await migrate(db, { migrationsFolder: 'src/schema/migrations' });

  process.exit(0);
}

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
