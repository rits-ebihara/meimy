"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitAccountState = () => {
    return {
        authType: 'o365',
        eimToken: [],
        id: null,
        lastConnect: null,
        siteDomain: '',
        siteName: '',
    };
};
