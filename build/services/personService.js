"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const groupsService_1 = __importDefault(require("./groupsService"));
const prisma = new client_1.PrismaClient();
class PersonService {
    constructor() {
        this.getAll = async (filters) => {
            try {
                return await prisma.people.findMany({ where: filters });
            }
            catch (error) {
                return false;
            }
        };
        this.getPerson = async (filters) => {
            try {
                if (!filters.id && !filters.cpf) {
                    return false;
                }
                else {
                    return await prisma.people.findFirst({ where: filters });
                }
            }
            catch (error) {
                return false;
            }
        };
        this.createPerson = async (data) => {
            try {
                if (!data.id_group) {
                    return false;
                }
                const group = await groupsService_1.default.getGroup({
                    id: data.id_group,
                    id_event: data.id_event,
                });
                if (group) {
                    return await prisma.people.create({ data });
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return;
            }
        };
        this.updatePerson = async (filters, data) => {
            try {
                return await prisma.people.updateMany({ where: filters, data });
            }
            catch (error) {
                return false;
            }
        };
        this.deletePerson = async (filters) => {
            try {
                return await prisma.people.delete({ where: filters });
            }
            catch (error) {
                return false;
            }
        };
    }
}
exports.default = new PersonService();
