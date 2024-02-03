import { RequestHandler } from "express";
import { z } from "zod";
import AuthService from "../../services/authService";

class AuthController {

    login: RequestHandler = (req, res) => {
        const loginSchema = z.object({
            password: z.string(),
        });

        const body = loginSchema.safeParse(req.body);
        if (!body.success) return res.json({ error: "Invalid data" });

        // validar senha e gerar o token
        if (!AuthService.validatePassword(body.data.password)) {
            return res.status(403).json({ error: "Access Denied" });
        }
        res.json({ token: AuthService.createToken() });
        // retorno da requisição
    };
}

export default new AuthController();
