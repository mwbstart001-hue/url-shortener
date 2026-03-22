"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlController_1 = require("../controllers/urlController");
const router = (0, express_1.Router)();
router.post('/shorten', urlController_1.createShortUrlHandler);
router.get('/stats/:shortCode', urlController_1.getUrlStatsHandler);
router.get('/stats', urlController_1.getOverallStatsHandler);
exports.default = router;
