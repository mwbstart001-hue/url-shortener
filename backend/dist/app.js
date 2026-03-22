"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const urlRoutes_1 = __importDefault(require("./routes/urlRoutes"));
const urlController_1 = require("./controllers/urlController");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', urlRoutes_1.default);
app.get('/:shortCode', urlController_1.redirectHandler);
app.get('/health', (req, res) => {
    res.json({
        code: 200,
        message: 'Server is running',
        data: {
            timestamp: new Date().toISOString()
        }
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
