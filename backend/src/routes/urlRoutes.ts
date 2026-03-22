import { Router } from 'express';
import { createShortUrlHandler, getUrlStatsHandler, getOverallStatsHandler } from '../controllers/urlController';

const router = Router();

router.post('/shorten', createShortUrlHandler);
router.get('/stats/:shortCode', getUrlStatsHandler);
router.get('/stats', getOverallStatsHandler);

export default router;
