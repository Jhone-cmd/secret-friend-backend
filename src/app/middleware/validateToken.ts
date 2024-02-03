import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import jwtConfig from "../../utils/jwtConfig";

export const validate: RequestHandler = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Token was not provided." });
    }

    const [, token] = authHeader.split(" ");

    try {
        await jwt.verify(token, jwtConfig.keyConfig as string);
        return next();
    } catch (error) {
        return res.status(401).json({ error: "Token Invalid." });
    }
};
