"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const contact_1 = __importDefault(require("./contact"));
const resources_1 = __importDefault(require("./resources"));
const router = (0, express_1.Router)();
exports.router = router;
router.use('/auth', auth_1.default);
router.use('/contact', contact_1.default);
router.use('/resources', resources_1.default);
