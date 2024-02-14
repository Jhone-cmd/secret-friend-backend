import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { ErrorRequestHandler } from "express-serve-static-core";
import cors from "cors";
import Youch from "youch";
import siteRoutes from "./app/routes/site";
import adminRoutes from "./app/routes/admin";

class App {
    server: any;
    constructor() {
        this.server = express();
        this.middleware();
        this.routes();
        this.exceptionHandler();
    }

    middleware() {
        this.server.use(cors());
        this.server.use(express.json());
    }

    routes() {
        this.server.use("/admin", adminRoutes);
        this.server.use("/", siteRoutes);
    }

    exceptionHandler() {
        this.server.use(
            async (
                erro: ErrorRequestHandler,
                req: Request,
                res: Response,
                next: NextFunction
            ) => {
                const errors = await new Youch(erro, req).toJSON();

                if (process.env.NODE_ENV === "development") {
                    return res.status(500).send(errors);
                }

                return res.status(500).json({ error: "Internal Server Error" });
            }
        );
    }
}

export default new App().server;
