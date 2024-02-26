"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const groupsService_1 = __importDefault(require("../../services/groupsService"));
class GroupsController {
    constructor() {
        this.getAll = async (req, res) => {
            const { id_event } = req.params;
            const items = await groupsService_1.default.getAll(parseInt(id_event));
            if (items) {
                return res.json({ groups: items });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.getGroup = async (req, res) => {
            const { id, id_event } = req.params;
            const groupItem = await groupsService_1.default.getGroup({
                id: parseInt(id),
                id_event: parseInt(id_event),
            });
            if (groupItem) {
                return res.json({ group: groupItem });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.createGroup = async (req, res) => {
            const { id_event } = req.params;
            const createGroupSchema = zod_1.z.object({
                name: zod_1.z.string(),
            });
            const body = createGroupSchema.safeParse(req.body);
            if (!body.success) {
                return res.json({ error: "Invalid Data" });
            }
            const newGroup = await groupsService_1.default.createGroup({
                name: body.data.name,
                id_event: parseInt(id_event),
            });
            if (newGroup) {
                return res.status(201).json({ newGroup });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.updateGroup = async (req, res) => {
            const { id, id_event } = req.params;
            const updateGroupSchema = zod_1.z.object({
                name: zod_1.z.string().optional(),
            });
            const body = updateGroupSchema.safeParse(req.body);
            if (!body.success) {
                return res.json({ error: "Invalid Data" });
            }
            const updatedGroup = await groupsService_1.default.updateGroup({
                id: parseInt(id),
                id_event: parseInt(id_event),
            }, body.data);
            if (updatedGroup) {
                return res.json({ group: updatedGroup });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
        this.deleteGroup = async (req, res) => {
            const { id, id_event } = req.params;
            const deletedGroup = await groupsService_1.default.deleteGroup({
                id: parseInt(id),
                id_event: parseInt(id_event),
            });
            if (deletedGroup) {
                return res.json({
                    group: "Group Deleted Successfully",
                    deletedGroup,
                });
            }
            else {
                return res.json({ error: "An error has occurred" });
            }
        };
    }
}
exports.default = new GroupsController();
