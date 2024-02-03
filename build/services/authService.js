"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getToday_1 = require("../utils/getToday");
const jwtConfig_1 = __importDefault(require("../utils/jwtConfig"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.validatePassword = (password) => {
            const currentPassword = getToday_1.getToday.split("/").join("");
            return password === currentPassword;
        };
        this.createToken = () => {
            const token = jsonwebtoken_1.default.sign({ getToday: getToday_1.getToday }, jwtConfig_1.default.keyConfig, {
                expiresIn: jwtConfig_1.default.expiresin,
            });
            return token;
            // retorna o Token
        };
    }
}
exports.default = new AuthService();
