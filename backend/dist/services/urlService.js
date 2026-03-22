"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortUrl = createShortUrl;
exports.getOriginalUrl = getOriginalUrl;
exports.getUrlStats = getUrlStats;
exports.getOverallStats = getOverallStats;
const database_1 = __importDefault(require("../database"));
const redis_1 = __importDefault(require("../redis"));
function generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
async function createShortUrl(originalUrl, expiresAt) {
    const db = await (0, database_1.default)();
    const existing = await db.get('SELECT shortCode FROM urls WHERE originalUrl = ?', originalUrl);
    if (existing) {
        return existing.shortCode;
    }
    let shortCode;
    let attempts = 0;
    do {
        shortCode = generateShortCode();
        attempts++;
        const exists = await db.get('SELECT 1 FROM urls WHERE shortCode = ?', shortCode);
        if (!exists || attempts > 10)
            break;
    } while (true);
    await db.run(`
    INSERT INTO urls (shortCode, originalUrl, expiresAt)
    VALUES (?, ?, ?)
  `, shortCode, originalUrl, expiresAt || null);
    try {
        await redis_1.default.setEx(`url:${shortCode}`, 3600, originalUrl);
    }
    catch (err) {
        console.log('Redis cache set failed:', err);
    }
    return shortCode;
}
async function getOriginalUrl(shortCode, userAgent, ipAddress) {
    const db = await (0, database_1.default)();
    try {
        const cached = await redis_1.default.get(`url:${shortCode}`);
        if (cached) {
            await db.run('UPDATE urls SET visitCount = visitCount + 1 WHERE shortCode = ?', shortCode);
            await db.run('INSERT INTO visits (shortCode, userAgent, ipAddress) VALUES (?, ?, ?)', shortCode, userAgent || null, ipAddress || null);
            return cached;
        }
    }
    catch (err) {
        console.log('Redis cache get failed:', err);
    }
    const result = await db.get('SELECT originalUrl, expiresAt FROM urls WHERE shortCode = ?', shortCode);
    if (!result)
        return null;
    if (result.expiresAt && new Date(result.expiresAt) < new Date()) {
        return null;
    }
    await db.run('UPDATE urls SET visitCount = visitCount + 1 WHERE shortCode = ?', shortCode);
    await db.run('INSERT INTO visits (shortCode, userAgent, ipAddress) VALUES (?, ?, ?)', shortCode, userAgent || null, ipAddress || null);
    try {
        await redis_1.default.setEx(`url:${shortCode}`, 3600, result.originalUrl);
    }
    catch (err) {
        console.log('Redis cache set failed:', err);
    }
    return result.originalUrl;
}
async function getUrlStats(shortCode) {
    const db = await (0, database_1.default)();
    const urlInfo = await db.get(`
    SELECT shortCode, originalUrl, createdAt, expiresAt, visitCount
    FROM urls WHERE shortCode = ?
  `, shortCode);
    if (!urlInfo)
        return null;
    const recentVisits = await db.all(`
    SELECT visitedAt, userAgent, ipAddress
    FROM visits WHERE shortCode = ?
    ORDER BY visitedAt DESC
    LIMIT 10
  `, shortCode);
    return {
        ...urlInfo,
        recentVisits
    };
}
async function getOverallStats() {
    const db = await (0, database_1.default)();
    const totalUrls = await db.get('SELECT COUNT(*) as count FROM urls');
    const totalVisits = await db.get('SELECT COUNT(*) as count FROM visits');
    const topUrls = await db.all(`
    SELECT shortCode, originalUrl, visitCount, createdAt
    FROM urls
    ORDER BY visitCount DESC
    LIMIT 5
  `);
    return {
        totalUrls: totalUrls.count,
        totalVisits: totalVisits.count,
        topUrls
    };
}
