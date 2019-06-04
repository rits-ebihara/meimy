/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import UrlParse from 'url-parse';

import { ClientError } from './ClientError';
import { IDoc, IGroupDoc, IUserDoc } from './EIMDocInterface';
import { IDocListForView, IDocListRowColForView } from './IDocListForView';
import { IDocListSearchOption } from './IDocListSearchOption';
import { ILangResources } from './ILangResources';
import { IParsedResponse, IResponse } from './IResponse';
import { IResponseDownloadFile } from './IResponseDownloadFile';

export const dateParser = (_key: string, value: any) => {
    const dateReg = /^\d{4}-\d{2}-\d{2}T(?:\d{2}:){2}\d{2}\.\d{3}Z$/;
    if (typeof value === 'string' && dateReg.test(value)) {
        return new Date(value);
    } else {
        return value;
    }
};
const dateStringify = (_key: string, value: any) => {
    if (value instanceof Date) {
        return moment(value).format('YYYY-MM-DDTHH:mm:ss[T]');
    } else {
        return value;
    }
};


export class EIMServiceAdapter {
    private baseUrl: string;
    private defaultHeader = {
        'Content-Type': 'application/json',
    };
    public constructor(domain: string) {
        this.baseUrl = `https://${domain}`;
    }
    public get = async (
        path: string,
        token: string[],
        header?: { [key: string]: string },
        params?: { [key: string]: string }): Promise<IResponse> => {
        const url = this.createUrl(path, params || {});
        const sendHeader = Object.assign({}, this.defaultHeader, header);
        if (!!token) {
            sendHeader.Cookie = token.join('; ');
        }
        const response = await fetch(url, {
            headers: sendHeader,
            method: 'GET',
        });
        const res: IResponse = await this.createResponse(response);
        return res;
    }

    public post = async (path: string,
        token: string[],
        data: { [key: string]: any },
        header: { [key: string]: string } = {},
        params?: { [key: string]: string }) => {
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
    }

    public validateToken = async (tokens: string[]) => {
        const response = await this.get(
            '/resources/v1/apps',
            tokens,
        );
        return response.statusCode === 200;
    }

    public getAppList = async (tokens: string[]) => {
        return await this.get(
            '/resources/v1/apps',
            tokens,
        );
    }
    public getDocListForView = async <T = any>(
        tokens: string[],
        appKey: string, docListKey: string,
        options?: IDocListSearchOption<T>) => {
        const response = await this.post(
            `services/v3/apps/${appKey}/documentlists/${docListKey}/listview`,
            tokens,
            options || {},
        );
        if (response.statusCode !== 200) {
            throw new ClientError(response);
        }
        return JSON.parse(response.body, dateParser) as IDocListForView<T>;
    }
    public getDocumentById = async <T>(
        tokens: string[],
        docId: string) => {
        const response = await this.get(
            `/resources/v1/documents/${docId}`,
            tokens) as IParsedResponse<IDoc<T>>;
        if (response.statusCode === 200) {
            response.parsedBody = JSON.parse(response.body, dateParser);
        }
        return response;
    }
    public getUserDocById = (
        tokens: string[],
        userId: string): Promise<IParsedResponse<IUserDoc>> => {
        return new Promise((resolve, reject) => {
            this.get(
                `/services/v1/users/${userId}`,
                tokens,
            ).then((pResponse) => {
                const response = pResponse as IParsedResponse<IUserDoc>;
                if (response.statusCode === 200) {
                    response.parsedBody = JSON.parse(response.body, dateParser);
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
    }
    public getGroupDocById = (
        tokens: string[],
        groupId: string) => {
        return new Promise((resolve, reject) => {
            this.get(
                `/services/v1/groups/${groupId}`,
                tokens,
            ).then((pResponse) => {
                const response = pResponse as IParsedResponse<IGroupDoc>;
                if (response.statusCode === 200) {
                    response.parsedBody = JSON.parse(response.body, dateParser);
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
    }
    public getAttachmentFile = async (tokens: string[], fileId: string) => {
        const response = await this.get(`/services/v1/files/download/${fileId}`, tokens);
        if (response.statusCode === 200) {
            const fileInfo = JSON.parse(response.body, dateParser) as IResponseDownloadFile;
            return fileInfo;
        } else {
            throw new Error(`添付ファイルの取得に失敗しました。(status code:${response.statusCode})`);
        }
    }
    public getLoginUser = async (tokens: string[]) => {
        const response = await this.get('/services/v1/users', tokens);
        if (response.statusCode === 200) {
            return JSON.parse(response.body, dateParser) as IUserDoc;
        } else {
            return null;
        }
    }
    public executeScript = async (
        tokens: string[], appId: string, fileName: string,
        data: object, async: boolean = false) => {
        const params = {
            async: async ? 'true' : 'false',
            filename: fileName,
        };
        const result = await this.post(
            `/services/v1/apps/${appId}/scripts/call`,
            tokens, data, { 'Content-Type': 'text/plain' }
            , params,
        );
        return result;
    }
    public getLangResource = async (tokens: string[], appId: string): Promise<ILangResources> => {
        try {
            const result = await this.get(
                `/resources/v1/apps/${appId}/strings`,
                tokens);
            if (result.statusCode === 200) {
                return JSON.parse(result.body) as ILangResources;
            } else {
                throw new Error(`文字列リソースの取得に失敗しました。 (status code:${result.statusCode}`);
            }
        } catch (e) {
            throw e;
        }
    }
    private async createResponse(response: Response) {
        const headers: {
            [key: string]: string;
        } = {};
        const body = await response.text();
        const res: IResponse = {
            body,
            contentType: response.headers.get('Content-Type') || '',
            headers,
            statusCode: response.status,
            tokens: [],
        };
        return res;
    }

    private createUrl(path: string, queryParams?: { [key: string]: string }) {
        const url = UrlParse(this.baseUrl, true);
        url.set('pathname', path);
        url.set('query', queryParams);
        return url.href;
    }
}

export const getDocListValue = <T = any>
(columnValues: IDocListRowColForView<T>[], propName: keyof T) => {
    const column = columnValues.find(c => c.propertyName === propName);
    if (!column) { return undefined; }
    return column.value;
}
