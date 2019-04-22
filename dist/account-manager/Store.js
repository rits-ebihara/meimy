"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AccountListReducer_1 = __importDefault(require("./reducers/AccountListReducer"));
const AccountReducer_1 = __importDefault(require("./reducers/AccountReducer"));
const EimAppListReducer_1 = __importDefault(require("./reducers/EimAppListReducer"));
const WebSignInReducer_1 = __importDefault(require("./reducers/WebSignInReducer"));
exports.reducers = {
    account: AccountReducer_1.default,
    accountList: AccountListReducer_1.default,
    appList: EimAppListReducer_1.default,
    webSignIn: WebSignInReducer_1.default,
};
