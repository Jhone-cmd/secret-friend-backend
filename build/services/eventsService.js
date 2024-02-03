"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const personService_1 = __importDefault(require("./personService"));
const randomMatch_1 = require("../utils/randomMatch");
const prisma = new client_1.PrismaClient();
class EventService {
    constructor() {
        this.getAll = async () => {
            try {
                return await prisma.event.findMany();
            }
            catch (error) {
                return false;
            }
        };
        this.getEvent = async (id) => {
            try {
                return await prisma.event.findFirst({ where: { id } });
            }
            catch (error) {
                return false;
            }
        };
        this.createEvent = async (data) => {
            try {
                return await prisma.event.create({ data });
            }
            catch (error) {
                return false;
            }
        };
        this.updateEvent = async (id, data) => {
            try {
                return await prisma.event.update({ where: { id }, data });
            }
            catch (error) {
                return false;
            }
        };
        this.deleteEvent = async (id) => {
            try {
                return await prisma.event.delete({ where: { id } });
            }
            catch (error) {
                return false;
            }
        };
        this.doMatches = async (id) => {
            const eventItem = await prisma.event.findFirst({
                where: { id },
                select: { grouped: true },
            });
            if (eventItem) {
                const peopleList = await personService_1.default.getAll({ id_event: id });
                if (peopleList) {
                    let sortedList = [];
                    let sortable = [];
                    let attempts = 0;
                    const maxAttempts = peopleList.length;
                    let keepTrying = true;
                    while (keepTrying && attempts < maxAttempts) {
                        keepTrying = false;
                        attempts++;
                        sortedList = [];
                        sortable = peopleList.map((item) => item.id);
                        for (const i in peopleList) {
                            let sortableFiltered = sortable;
                            if (eventItem.grouped) {
                                sortableFiltered = sortableFiltered.filter((sortableItem) => {
                                    const sortablePerson = peopleList.find((item) => item.id === sortableItem);
                                    return (peopleList[i].id_group !==
                                        sortablePerson?.id_group);
                                });
                            }
                            if (sortableFiltered.length === 0 ||
                                (sortableFiltered.length === 1 &&
                                    peopleList[i].id === sortableFiltered[0])) {
                                keepTrying = true;
                            }
                            else {
                                let sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
                                while (sortableFiltered[sortedIndex] ===
                                    peopleList[i].id) {
                                    sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
                                }
                                sortedList.push({
                                    id: peopleList[i].id,
                                    matche: sortableFiltered[sortedIndex],
                                });
                                sortable = sortable.filter((item) => item !== sortableFiltered[sortedIndex]);
                            }
                        }
                    }
                    if (attempts < maxAttempts) {
                        for (const i in sortedList) {
                            await personService_1.default.updatePerson({
                                id: sortedList[i].id,
                                id_event: id,
                            }, {
                                matche: await (0, randomMatch_1.encryptMatch)(sortedList[i].matche),
                            });
                        }
                        return true;
                    }
                }
            }
            return false;
        };
    }
}
exports.default = new EventService();
