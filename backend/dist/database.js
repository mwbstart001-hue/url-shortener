"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
let db = null;
async function initDatabase() {
    if (db)
        return db;
    db = await (0, sqlite_1.open)({
        filename: './urls.db',
        driver: sqlite3_1.default.Database
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
exports.default = initDatabase;
