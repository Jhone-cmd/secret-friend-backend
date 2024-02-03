"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const eventsController_1 = __importDefault(require("../controllers/eventsController"));
const groupsController_1 = __importDefault(require("../controllers/groupsController"));
const personController_1 = __importDefault(require("../controllers/personController"));
const validateToken_1 = require("../middleware/validateToken");
const router = (0, express_1.Router)();
router.post("/login", authController_1.default.login);
router.get("/ping", validateToken_1.validate, (req, res) => res.json({ pong: true, admin: true }));
router.use(validateToken_1.validate);
// * Events
router.post("/events", eventsController_1.default.createEvent);
router.get("/events", eventsController_1.default.getAll);
router.get("/events/:id", eventsController_1.default.getEvent);
router.put("/events/:id", eventsController_1.default.updateEvent);
router.delete("/events/:id", eventsController_1.default.deleteEvent);
// * Groups
router.post("/events/:id_event/groups", groupsController_1.default.createGroup);
router.get("/events/:id_event/groups", groupsController_1.default.getAll);
router.get("/events/:id_event/groups/:id", groupsController_1.default.getGroup);
router.put("/events/:id_event/groups/:id", groupsController_1.default.updateGroup);
router.delete("/events/:id_event/groups/:id", groupsController_1.default.deleteGroup);
// * People
router.post("/events/:id_event/groups/:id_group/people", personController_1.default.createPerson);
router.get("/events/:id_event/groups/:id_group/people", personController_1.default.getAll);
router.get("/events/:id_event/groups/:id_group/people/:id", personController_1.default.getPerson);
router.put("/events/:id_event/groups/:id_group/people/:id", personController_1.default.updatePerson);
router.delete("/events/:id_event/groups/:id_group/people/:id", personController_1.default.deletePerson);
exports.default = router;
