"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const moment_1 = __importDefault(require("moment"));
const react_native_1 = require("react-native");
const url_parse_1 = __importDefault(require("url-parse"));
const sshWebClient = react_native_1.NativeModules.OkHttp3WebClient;
const dateParser = (_key, value) => {
    const dateReg = /^\d{4}-\d{2}-\d{2}T(?:\d{2}:){2}\d{2}\.\d{3}Z$/;
    if (typeof value === 'string' && dateReg.test(value)) {
        return new Date(value);
    }
    else {
        return value;
    }
};
const dateStringify = (_key, value) => {
    if (value instanceof Date) {
        return moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss[T]');
    }
    else {
        return value;
    }
};
// tslint:disable-next-line:max-classes-per-file
class ClientError extends Error {
    constructor(data) {
        super();
        this.data = data;
    }
}
// tslint:disable-next-line:max-classes-per-file
class EIMServiceAdapter {
    constructor(domain) {
        this.defaultHeader = {
            'Content-Type': 'application/json',
        };
        this.get = async (path, token, header, params) => {
            const url = this.createUrl(path, params || {});
            const sendHeader = Object.assign({}, this.defaultHeader, header);
            if (!!token) {
                sendHeader.Cookie = token.join('; ');
            }
            const response = await fetch(url, {
                headers: sendHeader,
                method: 'GET',
            });
            const res = await this.createResponse(response);
            return res;
        };
        this.post = async (path, token, data, header = {}, params) => {
            const url = this.createUrl(path, params || {});
            const sendHeader = Object.assign({}, this.defaultHeader, header);
            sendHeader.Cookie = token.join('; ');
            const stringData = JSON.stringify(data, dateStringify);
            const res = await fetch(url, {
                body: stringData,
                headers: sendHeader,
                method: 'POST',
            });
            const response = this.createResponse(res);
            return response;
        };
        this.postForm = async (path, token, data, header = {}, params) => {
            const url = this.createUrl(path, params || {});
            const sendHeader = Object.assign({}, this.defaultHeader, header);
            sendHeader.Cookie = token.join('; ');
            // React Native fetch では、redirect をコントロールできない。勝手に転送されてしまうため、
            // set-cookie の token が取得できない
            const response = await sshWebClient.postForm(url, sendHeader, data, params || {});
            return response;
        };
        this.login = async (userId, password) => {
            const path = '/services/v1/login';
            try {
                const result = await this.postForm(path, [], { userName: userId, password });
                if (result.statusCode === 303 && !!result.tokens) {
                    return {
                        result: 'success',
                        tokens: result.tokens,
                    };
                }
                else {
                    return {
                        result: 'failed',
                        tokens: [],
                    };
                }
            }
            catch (e) {
                return {
                    result: 'error',
                    tokens: [],
                };
            }
        };
        this.validateToken = async (tokens) => {
            const response = await this.get('/resources/v1/apps', tokens);
            return response.statusCode === 200;
        };
        this.getAppList = async (tokens) => {
            return await this.get('/resources/v1/apps', tokens);
        };
        this.getDocListForView = async (tokens, appKey, docListKey, options) => {
            const response = await this.post(`services/v3/apps/${appKey}/documentlists/${docListKey}/listview`, tokens, options || {});
            if (response.statusCode !== 200) {
                throw new ClientError(response);
            }
            return JSON.parse(response.body, dateParser);
        };
        this.getDocumentById = async (tokens, docId) => {
            const response = await this.get(`/resources/v1/documents/${docId}`, tokens);
            if (response.statusCode === 200) {
                response.parsedBody = JSON.parse(response.body, dateParser);
            }
            return response;
        };
        this.getUserDocById = (tokens, userId) => {
            return new Promise((resolve, reject) => {
                this.get(`/services/v1/users/${userId}`, tokens).then((pResponse) => {
                    const response = pResponse;
                    if (response.statusCode === 200) {
                        response.parsedBody = JSON.parse(response.body, dateParser);
                        resolve(response);
                    }
                    else {
                        reject(response);
                    }
                });
            });
        };
        this.getGroupDocById = (tokens, groupId) => {
            return new Promise((resolve, reject) => {
                this.get(`/services/v1/groups/${groupId}`, tokens).then((pResponse) => {
                    const response = pResponse;
                    if (response.statusCode === 200) {
                        response.parsedBody = JSON.parse(response.body, dateParser);
                        resolve(response);
                    }
                    else {
                        reject(response);
                    }
                });
            });
        };
        this.getAttachmentFile = async (tokens, fileId) => {
            const response = await this.get(`/services/v1/files/download/${fileId}`, tokens);
            if (response.statusCode === 200) {
                const fileInfo = JSON.parse(response.body, dateParser);
                return fileInfo;
            }
            else {
                throw new Error(`添付ファイルの取得に失敗しました。(status code:${response.statusCode})`);
            }
        };
        this.getLoginUser = async (tokens) => {
            const response = await this.get(`/services/v1/users`, tokens);
            if (response.statusCode === 200) {
                return JSON.parse(response.body, dateParser);
            }
            else {
                return null;
            }
        };
        this.executeScript = async (tokens, appId, fileName, data, async = false) => {
            const params = {
                async: async ? 'true' : 'false',
                filename: fileName,
            };
            const result = await this.post(`/services/v1/apps/${appId}/scripts/call`, tokens, data, { 'Content-Type': 'text/plain' }, params);
            return result;
        };
        this.baseUrl = `https://${domain}`;
    }
    async createResponse(response) {
        const headers = {};
        const body = await response.text();
        const res = {
            body,
            contentType: response.headers.get('Content-Type') || '',
            headers,
            statusCode: response.status,
            tokens: [],
        };
        return res;
    }
    createUrl(path, queryParams) {
        const url = url_parse_1.default(this.baseUrl, true);
        url.set('pathname', path);
        url.set('query', queryParams);
        return url.href;
    }
}
exports.EIMServiceAdapter = EIMServiceAdapter;
