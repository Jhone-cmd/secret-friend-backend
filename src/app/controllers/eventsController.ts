import { RequestHandler } from "express";
import { z } from "zod";
import EventService from "../../services/eventsService";
import PersonService from "../../services/personService";

class EventsController {

    getAll: RequestHandler = async (req, res) => {
        const items = await EventService.getAll();

        if (items) {
            return res.json({ events: items });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    getEvent: RequestHandler = async (req, res) => {
        const { id } = req.params;
        const eventItem = await EventService.getEvent(parseInt(id));

        if (eventItem) {
            return res.json({ event: eventItem });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    createEvent: RequestHandler = async (req, res) => {
        const addEventSchema = z.object({
            title: z.string(),
            description: z.string(),
        });

        const body = addEventSchema.safeParse(req.body);
        if (!body.success) {
            return res.json({ error: "Invalid Data" });
        }

        const newEvent = await EventService.createEvent(body.data);

        if (newEvent) {
            return res.status(201).json({ event: newEvent });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    updateEvent: RequestHandler = async (req, res) => {
        const { id } = req.params;
        const eventUpdateSchema = z.object({
            status: z.boolean().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
            grouped: z.boolean().optional(),
        });

        const body = eventUpdateSchema.safeParse(req.body);

        if (!body.success) {
            return res.json({ error: "Invalid Data" });
        }

        const updatedEvent = await EventService.updateEvent(
            parseInt(id),
            body.data
        );

        if (updatedEvent) {
            if (updatedEvent.status) {
                // TODO: Fazer o sorteio
                const result = await EventService.doMatches(parseInt(id));
                if (!result) {
                    return res.json({ error: "Groups Impossible to Draw" });
                }
            } else {
                // TODO: Limpar o sorteio
                await PersonService.updatePerson(
                    {
                        id_event: parseInt(id),
                    },
                    { matche: "" }
                );
            }

            return res.json({ event: updatedEvent });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    deleteEvent: RequestHandler = async (req, res) => {
        const { id } = req.params;
        const deletedEvent = await EventService.deleteEvent(parseInt(id));

        if (deletedEvent) {
            return res.json({
                event: "Event Deleted Successfully",
                deletedEvent,
            });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };
}

export default new EventsController();
