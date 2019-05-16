"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientError extends Error {
    constructor(data) {
        super();
        this.data = data;
    }
}
exports.ClientError = ClientError;
