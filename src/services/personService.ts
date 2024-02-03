import { Prisma, PrismaClient } from "@prisma/client";
import GroupService from "./groupsService";

type GetAllFilters = { id_event: number; id_group?: number };
type GetSpecificFilters = {
    id_event: number;
    id_group?: number;
    id?: number;
    cpf?: string;
};
type DeleteFilters = { id: number; id_event?: number; id_group?: number };
type CreatePersonData = Prisma.Args<typeof prisma.people, "create">["data"];
type UpdatePersonData = Prisma.Args<typeof prisma.people, "update">["data"];

const prisma = new PrismaClient();
class PersonService {

    getAll = async (filters: GetAllFilters) => {
        try {
            return await prisma.people.findMany({ where: filters });
        } catch (error) {
            return false;
        }
    };

    getPerson = async (filters: GetSpecificFilters) => {
        try {
            if (!filters.id && !filters.cpf) {
                return false;
            } else {
                return await prisma.people.findFirst({ where: filters });
            }
        } catch (error) {
            return false;
        }
    };

    createPerson = async (data: CreatePersonData) => {
        try {
            if (!data.id_group) {
                return false;
            }
            const group = await GroupService.getGroup({
                id: data.id_group,
                id_event: data.id_event,
            });

            if (group) {
                return await prisma.people.create({ data });
            } else {
                return false;
            }
        } catch (error) {
            return;
        }
    };

    updatePerson = async (
        filters: GetSpecificFilters,
        data: UpdatePersonData
    ) => {
        try {
            return await prisma.people.updateMany({ where: filters, data });
        } catch (error) {
            return false;
        }
    };

    deletePerson = async (filters: DeleteFilters) => {
        try {
            return await prisma.people.delete({ where: filters });
        } catch (error) {
            return false;
        }
    };
}

export default new PersonService();
