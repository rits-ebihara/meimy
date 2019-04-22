"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shortid_1 = __importDefault(require("shortid"));
exports.SHOW_WEB_PAGE = shortid_1.default();
exports.createShowWebPageAction = (account) => {
    return {
        account,
        type: exports.SHOW_WEB_PAGE,
    };
};
