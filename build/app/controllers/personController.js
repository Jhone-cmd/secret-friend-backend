"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const personService_1 = __importDefault(require("../../services/personService"));
const randomMatch_1 = require("../../utils/randomMatch");
class PersonController {
    constructor() {
        this.getAll = async (req, res) => {
            const { id_event, id_group } = req.params;
            const items = await personService_1.default.getAll({
                id_event: parseInt(id_event),
                id_group: parseInt(id_group),
            });
            if (items) {
                return res.json({ people: items });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.getPerson = async (req, res) => {
            const { id, id_event, id_group } = req.params;
            const personItem = await personService_1.default.getPerson({
                id: parseInt(id),
                id_event: parseInt(id_event),
                id_group: parseInt(id_group),
            });
            if (personItem) {
                return res.json({ people: personItem });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.createPerson = async (req, res) => {
            const { id_event, id_group } = req.params;
            const createPersonSchema = zod_1.z.object({
                name: zod_1.z.string(),
                cpf: zod_1.z.string().transform((value) => value.replace(/\.|-/gm, "")),
            });
            const body = createPersonSchema.safeParse(req.body);
            if (!body.success) {
                return res.json({ error: "Invalid Data" });
            }
            const newPerson = await personService_1.default.createPerson({
                name: body.data.name,
                cpf: body.data.cpf,
                id_event: parseInt(id_event),
                id_group: parseInt(id_group),
            });
            if (newPerson) {
                return res.status(201).json({ people: newPerson });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.updatePerson = async (req, res) => {
            const { id, id_event, id_group } = req.params;
            const updatePersonSchema = zod_1.z.object({
                name: zod_1.z.string().optional(),
                cpf: zod_1.z
                    .string()
                    .transform((value) => value.replace(/\.|-/gm, ""))
                    .optional(),
                matched: zod_1.z.string().optional(),
            });
            const body = updatePersonSchema.safeParse(req.body);
            if (!body.success) {
                return res.json({ error: "Invalid Data" });
            }
            const updatedPerson = await personService_1.default.updatePerson({
                id: parseInt(id),
                id_event: parseInt(id_event),
                id_group: parseInt(id_group),
            }, body.data);
            if (updatedPerson) {
                const personItem = await personService_1.default.getPerson({
                    id: parseInt(id),
                    id_event: parseInt(id_event),
                });
                return res.json({ people: personItem });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.deletePerson = async (req, res) => {
            const { id, id_event, id_group } = req.params;
            const deletedPerson = await personService_1.default.deletePerson({
                id: parseInt(id),
                id_event: parseInt(id_event),
                id_group: parseInt(id_group),
            });
            if (deletedPerson) {
                return res.json({
                    people: "Person Deleted Successfully",
                    deletedPerson,
                });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.searchPerson = async (req, res) => {
            const { id_event } = req.params;
            const searchPersonSchema = zod_1.z.object({
                cpf: zod_1.z.string().transform((value) => value.replace(/\.|-/gm, "")),
            });
            const query = searchPersonSchema.safeParse(req.query);
            if (!query.success) {
                return res.json({ error: "Invalid Data" });
            }
            const personItem = await personService_1.default.getPerson({
                id_event: parseInt(id_event),
                cpf: query.data.cpf,
            });
            if (personItem && personItem.matche) {
                const matcheID = await (0, randomMatch_1.decryptMatch)(personItem.matche);
                const personMatched = await personService_1.default.getPerson({
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
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
    }
}
exports.default = new PersonController();
