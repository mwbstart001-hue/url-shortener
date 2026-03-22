import { Request, Response } from 'express';
import { createShortUrl, getOriginalUrl, getUrlStats, getOverallStats } from '../services/urlService';

function sendResponse(res: Response, data: any, message: string = 'success', code: number = 200) {
  res.status(code).json({
    code,
    message,
    data
  });
}

export async function createShortUrlHandler(req: Request, res: Response) {
  try {
    const { originalUrl, expiresAt } = req.body;

    if (!originalUrl) {
      return sendResponse(res, null, 'originalUrl is required', 400);
    }

    const urlPattern = /^(https?:\/\/)/;
    const formattedUrl = urlPattern.test(originalUrl) ? originalUrl : `https://${originalUrl}`;

    const shortCode = await createShortUrl(formattedUrl, expiresAt ? new Date(expiresAt) : undefined);

    sendResponse(res, {
      shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
      originalUrl: formattedUrl
    }, 'Short URL created successfully');
  } catch (error) {
    console.error(error);
    sendResponse(res, null, 'Internal server error', 500);
  }
}

export async function redirectHandler(req: Request, res: Response) {
  try {
    const { shortCode } = req.params;
    const userAgent = req.get('User-Agent');
    const ipAddress = (req.ip || req.connection.remoteAddress) as string;

    const originalUrl = await getOriginalUrl(shortCode as string, userAgent, ipAddress);

    if (!originalUrl) {
      return res.status(404).json({
        code: 404,
        message: 'Short URL not found or expired',
        data: null
      });
    }

    res.redirect(originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null
    });
  }
}

export async function getUrlStatsHandler(req: Request, res: Response) {
  try {
    const { shortCode } = req.params;
    const stats = await getUrlStats(shortCode as string);

    if (!stats) {
      return sendResponse(res, null, 'Short URL not found', 404);
    }

    sendResponse(res, stats);
  } catch (error) {
    console.error(error);
    sendResponse(res, null, 'Internal server error', 500);
  }
}

export async function getOverallStatsHandler(req: Request, res: Response) {
  try {
    const stats = await getOverallStats();
    sendResponse(res, stats);
  } catch (error) {
    console.error(error);
    sendResponse(res, null, 'Internal server error', 500);
  }
}
