"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const eventsService_1 = __importDefault(require("../../services/eventsService"));
const personService_1 = __importDefault(require("../../services/personService"));
class EventsController {
    constructor() {
        this.getAll = async (req, res) => {
            const items = await eventsService_1.default.getAll();
            if (items) {
                return res.json({ events: items });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.getEvent = async (req, res) => {
            const { id } = req.params;
            const eventItem = await eventsService_1.default.getEvent(parseInt(id));
            if (eventItem) {
                return res.json({ event: eventItem });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.createEvent = async (req, res) => {
            const addEventSchema = zod_1.z.object({
                title: zod_1.z.string(),
                description: zod_1.z.string(),
            });
            const body = addEventSchema.safeParse(req.body);
            if (!body.success) {
                return res.json({ error: "Invalid Data" });
            }
            const newEvent = await eventsService_1.default.createEvent(body.data);
            if (newEvent) {
                return res.status(201).json({ event: newEvent });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.updateEvent = async (req, res) => {
            const { id } = req.params;
            const eventUpdateSchema = zod_1.z.object({
                status: zod_1.z.boolean().optional(),
                title: zod_1.z.string().optional(),
                description: zod_1.z.string().optional(),
                grouped: zod_1.z.boolean().optional(),
            });
            const body = eventUpdateSchema.safeParse(req.body);
            if (!body.success) {
                return res.json({ error: "Invalid Data" });
            }
            const updatedEvent = await eventsService_1.default.updateEvent(parseInt(id), body.data);
            if (updatedEvent) {
                if (updatedEvent.status) {
                    // TODO: Fazer o sorteio
                    const result = await eventsService_1.default.doMatches(parseInt(id));
                    if (!result) {
                        return res.json({ error: "Groups Impossible to Draw" });
                    }
                }
                else {
                    // TODO: Limpar o sorteio
                    await personService_1.default.updatePerson({
                        id_event: parseInt(id),
                    }, { matche: "" });
                }
                return res.json({ event: updatedEvent });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.deleteEvent = async (req, res) => {
            const { id } = req.params;
            const deletedEvent = await eventsService_1.default.deleteEvent(parseInt(id));
            if (deletedEvent) {
                return res.json({
                    event: "Event Deleted Successfully",
                    deletedEvent,
                });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
    }
}
exports.default = new EventsController();
