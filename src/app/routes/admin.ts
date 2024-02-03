import { Router } from "express";
import AuthController from "../controllers/authController";
import EventsController from "../controllers/eventsController";
import GroupsController from "../controllers/groupsController";
import PersonController from "../controllers/personController";
import { validate } from "../middleware/validateToken";

const router = Router();

router.post("/login", AuthController.login);
router.get("/ping", validate, (req, res) =>
    res.json({ pong: true, admin: true })
);

router.use(validate);

// * Events
router.post("/events", EventsController.createEvent);
router.get("/events", EventsController.getAll);
router.get("/events/:id", EventsController.getEvent);
router.put("/events/:id", EventsController.updateEvent);
router.delete("/events/:id", EventsController.deleteEvent);

// * Groups
router.post("/events/:id_event/groups", GroupsController.createGroup);
router.get("/events/:id_event/groups", GroupsController.getAll);
router.get("/events/:id_event/groups/:id", GroupsController.getGroup);
router.put("/events/:id_event/groups/:id", GroupsController.updateGroup);
router.delete("/events/:id_event/groups/:id", GroupsController.deleteGroup);

// * People
router.post(
    "/events/:id_event/groups/:id_group/people",
    PersonController.createPerson
);
router.get(
    "/events/:id_event/groups/:id_group/people",
    PersonController.getAll
);
router.get(
    "/events/:id_event/groups/:id_group/people/:id",
    PersonController.getPerson
);
router.put(
    "/events/:id_event/groups/:id_group/people/:id",
    PersonController.updatePerson
);
router.delete(
    "/events/:id_event/groups/:id_group/people/:id",
    PersonController.deletePerson
);

export default router;
