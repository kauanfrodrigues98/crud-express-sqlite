import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

sqlite3.verbose();

export const initDB = async (execMigrations = false) => {
  const db = await open({
    filename: './database/database.db',
    driver: sqlite3.Database,
  });

  if (execMigrations) {
    await migrations(db);
  }

  return db;
};

const migrations = async (db) => {
  console.log('Executing migrations');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE
    )
  `);
  console.log('Migrations executed');
}