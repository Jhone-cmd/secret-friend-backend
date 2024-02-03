"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptMatch = exports.encryptMatch = void 0;
require("dotenv/config");
const encryptMatch = async (id) => {
    return `${process.env.RANDOM}${id}${process.env.RANDOM}`;
};
exports.encryptMatch = encryptMatch;
const decryptMatch = async (matche) => {
    const idString = matche.replace(`${process.env.RANDOM}`, "").replace(`${process.env.RANDOM}`, "");
    return parseInt(idString);
};
exports.decryptMatch = decryptMatch;
