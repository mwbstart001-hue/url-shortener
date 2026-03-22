import initDatabase from '../database';
import redisClient from '../redis';

function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createShortUrl(originalUrl: string, expiresAt?: Date): Promise<string> {
  const db = await initDatabase();
  
  const existing = await db.get('SELECT shortCode FROM urls WHERE originalUrl = ?', originalUrl);
  
  if (existing) {
    return existing.shortCode;
  }

  let shortCode: string;
  let attempts = 0;
  
  do {
    shortCode = generateShortCode();
    attempts++;
    const exists = await db.get('SELECT 1 FROM urls WHERE shortCode = ?', shortCode);
    if (!exists || attempts > 10) break;
  } while (true);

  await db.run(`
    INSERT INTO urls (shortCode, originalUrl, expiresAt)
    VALUES (?, ?, ?)
  `, shortCode, originalUrl, expiresAt || null);

  try {
    await redisClient.setEx(`url:${shortCode}`, 3600, originalUrl);
  } catch (err) {
    console.log('Redis cache set failed:', err);
  }

  return shortCode;
}

export async function getOriginalUrl(shortCode: string, userAgent?: string, ipAddress?: string): Promise<string | null> {
  const db = await initDatabase();

  try {
    const cached = await redisClient.get(`url:${shortCode}`);
    if (cached) {
      await db.run('UPDATE urls SET visitCount = visitCount + 1 WHERE shortCode = ?', shortCode);
      await db.run('INSERT INTO visits (shortCode, userAgent, ipAddress) VALUES (?, ?, ?)', shortCode, userAgent || null, ipAddress || null);
      return cached;
    }
  } catch (err) {
    console.log('Redis cache get failed:', err);
  }

  const result = await db.get('SELECT originalUrl, expiresAt FROM urls WHERE shortCode = ?', shortCode);

  if (!result) return null;

  if (result.expiresAt && new Date(result.expiresAt) < new Date()) {
    return null;
  }

  await db.run('UPDATE urls SET visitCount = visitCount + 1 WHERE shortCode = ?', shortCode);
  await db.run('INSERT INTO visits (shortCode, userAgent, ipAddress) VALUES (?, ?, ?)', shortCode, userAgent || null, ipAddress || null);

  try {
    await redisClient.setEx(`url:${shortCode}`, 3600, result.originalUrl);
  } catch (err) {
    console.log('Redis cache set failed:', err);
  }

  return result.originalUrl;
}

export async function getUrlStats(shortCode: string) {
  const db = await initDatabase();

  const urlInfo = await db.get(`
    SELECT shortCode, originalUrl, createdAt, expiresAt, visitCount
    FROM urls WHERE shortCode = ?
  `, shortCode);

  if (!urlInfo) return null;

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

export async function getOverallStats() {
  const db = await initDatabase();

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
