"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const youch_1 = __importDefault(require("youch"));
const site_1 = __importDefault(require("./app/routes/site"));
const admin_1 = __importDefault(require("./app/routes/admin"));
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.middleware();
        this.routes();
        this.exceptionHandler();
    }
    middleware() {
        this.server.use((0, cors_1.default)());
        this.server.use(express_1.default.json());
        this.server.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.server.use("/admin", admin_1.default);
        this.server.use("/", site_1.default);
    }
    exceptionHandler() {
        this.server.use(async (erro, req, res, next) => {
            const errors = await new youch_1.default(erro, req).toJSON();
            if (process.env.NODE_ENV === "development") {
                return res.status(500).send(errors);
            }
            return res.status(500).json({ error: "Internal Server Error" });
        });
    }
}
exports.default = new App().server;
