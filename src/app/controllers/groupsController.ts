import { RequestHandler } from "express";
import { z } from "zod";
import GroupService from "../../services/groupsService";

class GroupsController {

    getAll: RequestHandler = async (req, res) => {
        const { id_event } = req.params;
        const items = await GroupService.getAll(parseInt(id_event));

        if (items) {
            return res.json({ groups: items });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    getGroup: RequestHandler = async (req, res) => {
        const { id, id_event } = req.params;

        const groupItem = await GroupService.getGroup({
            id: parseInt(id),
            id_event: parseInt(id_event),
        });

        if (groupItem) {
            return res.json({ group: groupItem });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    createGroup: RequestHandler = async (req, res) => {
        const { id_event } = req.params;
        const createGroupSchema = z.object({
            name: z.string(),
        });
        const body = createGroupSchema.safeParse(req.body);

        if (!body.success) {
            return res.json({ error: "Invalid Data" });
        }
        const newGroup = await GroupService.createGroup({
            name: body.data.name,
            id_event: parseInt(id_event),
        });

        if (newGroup) {
            return res.status(201).json({ newGroup });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    updateGroup: RequestHandler = async (req, res) => {
        const { id, id_event } = req.params;
        const updateGroupSchema = z.object({
            name: z.string().optional(),
        });

        const body = updateGroupSchema.safeParse(req.body);
        if (!body.success) {
            return res.json({ error: "Invalid Data" });
        }

        const updatedGroup = await GroupService.updateGroup(
            {
                id: parseInt(id),
                id_event: parseInt(id_event),
            },
            body.data
        );

        if (updatedGroup) {
            return res.json({ group: updatedGroup });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };

    deleteGroup: RequestHandler = async (req, res) => {
        const { id, id_event } = req.params;

        const deletedGroup = await GroupService.deleteGroup({
            id: parseInt(id),
            id_event: parseInt(id_event),
        });

        if (deletedGroup) {
            return res.json({
                group: "Group Deleted Successfully",
                deletedGroup,
            });
        } else {
            return res.json({ error: "An error has occurred" });
        }
    };
}

export default new GroupsController();
