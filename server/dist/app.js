"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('API is running...');
});
const MONGO_URI = process.env.MONGO_URI || '';
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
});
exports.default = app;
