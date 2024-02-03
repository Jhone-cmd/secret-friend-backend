"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    keyConfig: process.env.TOKENKEY,
    expiresin: "1d",
};
