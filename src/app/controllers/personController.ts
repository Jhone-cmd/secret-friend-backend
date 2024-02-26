import { RequestHandler } from "express";
import { z } from "zod";
import PersonService from "../../services/personService";
import { decryptMatch } from "../../utils/randomMatch";

class PersonController {

    getAll: RequestHandler = async (req, res) => {
        const { id_event, id_group } = req.params;

        const items = await PersonService.getAll({
            id_event: parseInt(id_event),
            id_group: parseInt(id_group),
        });

        if (items) {
            return res.json({ people: items });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    getPerson: RequestHandler = async (req, res) => {
        const { id, id_event, id_group } = req.params;
        const personItem = await PersonService.getPerson({
            id: parseInt(id),
            id_event: parseInt(id_event),
            id_group: parseInt(id_group),
        });

        if (personItem) {
            return res.json({ person: personItem });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    createPerson: RequestHandler = async (req, res) => {
        const { id_event, id_group } = req.params;
        const createPersonSchema = z.object({
            name: z.string(),
            cpf: z.string().transform((value) => value.replace(/\.|-/gm, "")),
        });

        const body = createPersonSchema.safeParse(req.body);
        if (!body.success) {
            return res.json({ error: "Invalid Data" });
        }

        const newPerson = await PersonService.createPerson({
            name: body.data.name,
            cpf: body.data.cpf,
            id_event: parseInt(id_event),
            id_group: parseInt(id_group),
        });

        if (newPerson) {
            return res.status(201).json({ newPerson });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    updatePerson: RequestHandler = async (req, res) => {
        const { id, id_event, id_group } = req.params;
        const updatePersonSchema = z.object({
            name: z.string().optional(),
            cpf: z
                .string()
                .transform((value) => value.replace(/\.|-/gm, ""))
                .optional(),
            matched: z.string().optional(),
        });

        const body = updatePersonSchema.safeParse(req.body);
        if (!body.success) {
            return res.json({ error: "Invalid Data" });
        }

        const updatedPerson = await PersonService.updatePerson(
            {
                id: parseInt(id),
                id_event: parseInt(id_event),
                id_group: parseInt(id_group),
            },
            body.data
        );

        if (updatedPerson) {
            const personItem = await PersonService.getPerson({
                id: parseInt(id),
                id_event: parseInt(id_event),
            });
            return res.json({ person: personItem });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    deletePerson: RequestHandler = async (req, res) => {
        const { id, id_event, id_group } = req.params;
        const deletedPerson = await PersonService.deletePerson({
            id: parseInt(id),
            id_event: parseInt(id_event),
            id_group: parseInt(id_group),
        });

        if (deletedPerson) {
            return res.json({
                people: "Person Deleted Successfully",
                deletedPerson,
            });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    searchPerson: RequestHandler = async (req, res) => {
        const { id_event } = req.params;

        const searchPersonSchema = z.object({
            cpf: z.string().transform((value) => value.replace(/\.|-/gm, "")),
        });

        const query = searchPersonSchema.safeParse(req.query);
        if (!query.success) {
            return res.json({ error: "Invalid Data" });
        }

        const personItem = await PersonService.getPerson({
            id_event: parseInt(id_event),
            cpf: query.data.cpf,
        });

        if (personItem && personItem.matche) {
            const matcheID = await decryptMatch(personItem.matche);

            const personMatched = await PersonService.getPerson({
                id_event: parseInt(id_event),
                id: matcheID,
            });

            if (personMatched) {
                return res.json({
                    person: {
                        id: personItem.id,
                        name: personItem.name,
                    },
                    personMatche: {
                        id: personMatched.id,
                        name: personMatched.name,
                    },
                });
            }
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };
}

export default new PersonController();
