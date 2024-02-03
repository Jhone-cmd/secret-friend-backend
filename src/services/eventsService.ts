import { PrismaClient, type Prisma } from "@prisma/client";
import PersonService from "./personService";
import { encryptMatch } from "../utils/randomMatch";

type CreateEventData = Prisma.Args<typeof prisma.event, "create">["data"];
type UpdateEventData = Prisma.Args<typeof prisma.event, "update">["data"];

const prisma = new PrismaClient();

class EventService {

    getAll = async () => {
        try {
            return await prisma.event.findMany();
        } catch (error) {
            return false;
        }
    };

    getEvent = async (id: number) => {
        try {
            return await prisma.event.findFirst({ where: { id } });
        } catch (error) {
            return false;
        }
    };

    createEvent = async (data: CreateEventData) => {
        try {
            return await prisma.event.create({ data });
        } catch (error) {
            return false;
        }
    };

    updateEvent = async (id: number, data: UpdateEventData) => {
        try {
            return await prisma.event.update({ where: { id }, data });
        } catch (error) {
            return false;
        }
    };

    deleteEvent = async (id: number) => {
        try {
            return await prisma.event.delete({ where: { id } });
        } catch (error) {
            return false;
        }
    };

    doMatches = async (id: number): Promise<boolean> => {
        const eventItem = await prisma.event.findFirst({
            where: { id },
            select: { grouped: true },
        });
        if (eventItem) {
            const peopleList = await PersonService.getAll({ id_event: id });

            if (peopleList) {
                let sortedList: { id: number; matche: number }[] = [];
                let sortable: number[] = [];

                let attempts = 0;
                const maxAttempts = peopleList.length;
                let keepTrying = true;

                while (keepTrying && attempts < maxAttempts) {
                    keepTrying = false;
                    attempts++;
                    sortedList = [];
                    sortable = peopleList.map((item) => item.id);

                    for (const i in peopleList) {
                        let sortableFiltered: number[] = sortable;
                        if (eventItem.grouped) {
                            sortableFiltered = sortableFiltered.filter(
                                (sortableItem) => {
                                    const sortablePerson = peopleList.find(
                                        (item) => item.id === sortableItem
                                    );
                                    return (
                                        peopleList[i].id_group !==
                                        sortablePerson?.id_group
                                    );
                                }
                            );
                        }

                        if (
                            sortableFiltered.length === 0 ||
                            (sortableFiltered.length === 1 &&
                                peopleList[i].id === sortableFiltered[0])
                        ) {
                            keepTrying = true;
                        } else {
                            let sortedIndex = Math.floor(
                                Math.random() * sortableFiltered.length
                            );
                            while (
                                sortableFiltered[sortedIndex] ===
                                peopleList[i].id
                            ) {
                                sortedIndex = Math.floor(
                                    Math.random() * sortableFiltered.length
                                );
                            }

                            sortedList.push({
                                id: peopleList[i].id,
                                matche: sortableFiltered[sortedIndex],
                            });

                            sortable = sortable.filter(
                                (item) => item !== sortableFiltered[sortedIndex]
                            );
                        }
                    }
                }

                if (attempts < maxAttempts) {
                    for (const i in sortedList) {
                        await PersonService.updatePerson(
                            {
                                id: sortedList[i].id,
                                id_event: id,
                            },
                            {
                                matche: await encryptMatch(
                                    sortedList[i].matche
                                ),
                            }
                        );
                    }
                    return true;
                }
            }
        }
        return false;
    };
}

export default new EventService();
