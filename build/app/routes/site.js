"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventsController_1 = __importDefault(require("../controllers/eventsController"));
const personController_1 = __importDefault(require("../controllers/personController"));
const router = (0, express_1.Router)();
router.get("/ping", (req, res) => res.json({ pong: true }));
router.get("/events/:id", eventsController_1.default.getEvent);
router.get("/events/:id_event/search", personController_1.default.searchPerson);
exports.default = router;
