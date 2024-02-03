"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const authService_1 = __importDefault(require("../../services/authService"));
class AuthController {
    constructor() {
        this.login = (req, res) => {
            const loginSchema = zod_1.z.object({
                password: zod_1.z.string(),
            });
            const body = loginSchema.safeParse(req.body);
            if (!body.success)
                return res.json({ error: "Invalid data" });
            // validar senha e gerar o token
            if (!authService_1.default.validatePassword(body.data.password)) {
                return res.status(403).json({ error: "Access Denied" });
            }
            res.json({ token: authService_1.default.createToken() });
            // retorno da requisição
        };
    }
}
exports.default = new AuthController();
