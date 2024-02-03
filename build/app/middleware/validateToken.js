"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = __importDefault(require("../../utils/jwtConfig"));
const validate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Token was not provided." });
    }
    const [, token] = authHeader.split(" ");
    try {
        await jsonwebtoken_1.default.verify(token, jwtConfig_1.default.keyConfig);
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: "Token Invalid." });
    }
};
exports.validate = validate;
