import { Prisma, PrismaClient } from "@prisma/client";
import EventService from "../services/eventsService";

const prisma = new PrismaClient();

type GetAllFilters = { id: number; id_event?: number };
type GroupCreateData = Prisma.Args<typeof prisma.group, "create">["data"];
type GroupUpdateData = Prisma.Args<typeof prisma.group, "update">["data"];

class GroupService {

    getAll = async (id_event: number) => {
        try {
            return await prisma.group.findMany({ where: { id_event } });
        } catch (error) {
            return false;
        }
    };

    getGroup = async (filters: GetAllFilters) => {
        try {
            return prisma.group.findFirst({ where: filters });
        } catch (error) {
            return false;
        }
    };

    createGroup = async (data: GroupCreateData) => {
        try {
            if (!data.id_event) {
                return false;
            }

            const eventItem = await EventService.getEvent(data.id_event);
            if (!eventItem) {
                return false;
            } else {
                return prisma.group.create({ data });
            }
        } catch (error) {
            return false;
        }
    };

    updateGroup = async (filters: GetAllFilters, data: GroupUpdateData) => {
        try {
            return await prisma.group.update({ where: filters, data });
        } catch (error) {
            return false;
        }
    };

    deleteGroup = async (filters: GetAllFilters) => {
        try {
            return await prisma.group.delete({ where: filters });
        } catch (error) {
            return false;
        }
    };
}

export default new GroupService();
