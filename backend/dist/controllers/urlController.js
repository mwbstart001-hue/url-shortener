"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortUrlHandler = createShortUrlHandler;
exports.redirectHandler = redirectHandler;
exports.getUrlStatsHandler = getUrlStatsHandler;
exports.getOverallStatsHandler = getOverallStatsHandler;
const urlService_1 = require("../services/urlService");
function sendResponse(res, data, message = 'success', code = 200) {
    res.status(code).json({
        code,
        message,
        data
    });
}
async function createShortUrlHandler(req, res) {
    try {
        const { originalUrl, expiresAt } = req.body;
        if (!originalUrl) {
            return sendResponse(res, null, 'originalUrl is required', 400);
        }
        const urlPattern = /^(https?:\/\/)/;
        const formattedUrl = urlPattern.test(originalUrl) ? originalUrl : `https://${originalUrl}`;
        const shortCode = await (0, urlService_1.createShortUrl)(formattedUrl, expiresAt ? new Date(expiresAt) : undefined);
        sendResponse(res, {
            shortCode,
            shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
            originalUrl: formattedUrl
        }, 'Short URL created successfully');
    }
    catch (error) {
        console.error(error);
        sendResponse(res, null, 'Internal server error', 500);
    }
}
async function redirectHandler(req, res) {
    try {
        const { shortCode } = req.params;
        const userAgent = req.get('User-Agent');
        const ipAddress = (req.ip || req.connection.remoteAddress);
        const originalUrl = await (0, urlService_1.getOriginalUrl)(shortCode, userAgent, ipAddress);
        if (!originalUrl) {
            return res.status(404).json({
                code: 404,
                message: 'Short URL not found or expired',
                data: null
            });
        }
        res.redirect(originalUrl);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: 'Internal server error',
            data: null
        });
    }
}
async function getUrlStatsHandler(req, res) {
    try {
        const { shortCode } = req.params;
        const stats = await (0, urlService_1.getUrlStats)(shortCode);
        if (!stats) {
            return sendResponse(res, null, 'Short URL not found', 404);
        }
        sendResponse(res, stats);
    }
    catch (error) {
        console.error(error);
        sendResponse(res, null, 'Internal server error', 500);
    }
}
async function getOverallStatsHandler(req, res) {
    try {
        const stats = await (0, urlService_1.getOverallStats)();
        sendResponse(res, stats);
    }
    catch (error) {
        console.error(error);
        sendResponse(res, null, 'Internal server error', 500);
    }
}
