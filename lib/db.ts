import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { ShoppingItem } from './types';

let db: any = null;

async function initializeDatabase() {
  if (db) return db;

  db = await open({
    filename: './data/shopping.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS shopping_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

export async function getDb() {
  return await initializeDatabase();
}

const dbUtils = { getDb };
export default dbUtils;