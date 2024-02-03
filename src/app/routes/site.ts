import { Router } from "express";
import EventsController from "../controllers/eventsController";
import PersonController from "../controllers/personController";

const router = Router();

router.get("/ping", (req, res) => res.json({ pong: true }));
router.get("/events/:id", EventsController.getEvent);
router.get("/events/:id_event/search", PersonController.searchPerson);

export default router;
