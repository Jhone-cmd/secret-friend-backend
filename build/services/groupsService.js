"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const eventsService_1 = __importDefault(require("../services/eventsService"));
const prisma = new client_1.PrismaClient();
class GroupService {
    constructor() {
        this.getAll = async (id_event) => {
            try {
                return await prisma.group.findMany({ where: { id_event } });
            }
            catch (error) {
                return false;
            }
        };
        this.getGroup = async (filters) => {
            try {
                return prisma.group.findFirst({ where: filters });
            }
            catch (error) {
                return false;
            }
        };
        this.createGroup = async (data) => {
            try {
                if (!data.id_event) {
                    return false;
                }
                const eventItem = await eventsService_1.default.getEvent(data.id_event);
                if (!eventItem) {
                    return false;
                }
                else {
                    return prisma.group.create({ data });
                }
            }
            catch (error) {
                return false;
            }
        };
        this.updateGroup = async (filters, data) => {
            try {
                return await prisma.group.update({ where: filters, data });
            }
            catch (error) {
                return false;
            }
        };
        this.deleteGroup = async (filters) => {
            try {
                return await prisma.group.delete({ where: filters });
            }
            catch (error) {
                return false;
            }
        };
    }
}
exports.default = new GroupService();
