import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

let db: any = null;

async function initDatabase() {
  if (db) return db;

  db = await open({
    filename: './urls.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shortCode TEXT UNIQUE NOT NULL,
      originalUrl TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expiresAt TIMESTAMP,
      visitCount INTEGER DEFAULT 0
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shortCode TEXT NOT NULL,
      visitedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      userAgent TEXT,
      ipAddress TEXT,
      FOREIGN KEY (shortCode) REFERENCES urls(shortCode)
    )
  `);

  return db;
}

export default initDatabase;
