/* eslint-disable @typescript-eslint/no-explicit-any */
import Moment from 'moment';
import UrlParse from 'url-parse';

export interface IResponse {
    body: string;
    statusCode: number;
    contentType: string;
    tokens: string[];
    headers: {
        [key: string]: string;
    };
}

export interface IParsedResponse<T> extends IResponse {
    parsedBody?: T;
}

// const sshWebClient = NativeModules.OkHttp3WebClient as ISshWebClient;

export interface ILoginResult {
    result: 'success' | 'failed' | 'error';
    tokens: string[];
}

export interface IDocListSearchOption<P> {
    offset: number;
    limit: number;
    search?: SearchCondition<P>[];
    sort?: IDocListSort<P>[];
}

export interface IDocListSort<T> {
    propertyName: keyof T;
    direction?: 'Ascending' | 'Descending';
}

export interface IAcl {
    readers?: any[];
    writers?: string[];
    readable?: boolean;
    writable?: boolean;
}

export interface ILink {
    rel?: string;
    href?: string;
}

export interface IProfile {
    id?: string;
    type?: string;
    roleId?: any;
}

export interface IMember {
    userId?: string;
    roles?: string[];
    type?: string;
}

export interface ITree {
    rootDocumentId?: string;
    parentDocumentId?: string;
    _pathId?: string;
}

export interface IAttachmentFiles {
    fileId: string;
    fileName: string;
    fileExtension: string;
    fileSize: number;
    lastModified: string;
    addCompleted: boolean;
}

export interface ISystem {
    acl?: IAcl;
    appId?: string;
    assignees?: string;
    attachmentFiles?: IAttachmentFiles[];
    children?: any[];
    condition?: any;
    createDatetime?: Date;
    createUserId?: string;
    createUser?: IUserDoc;
    lastModifiedUser?: IUserDoc;
    documentId: string;
    documentKey?: string;
    documentType?: string;
    executeVersion?: string;
    formId?: string;
    formKey?: string;
    lastModifiedDatetime?: Date;
    lastModifiedUserId?: string;
    links?: ILink[];
    members?: IMember[];
    modelId?: string;
    modelKey?: string;
    parents?: string[];
    revision?: number;
    siteId?: string;
    status?: string;
    taskInstances?: ITaskInstances;
    title?: string;
    tree?: ITree;
    users?: string[];
    version?: number;
    writers?: string[];
}

export interface ITaskInstances {
    assignees?: string[];
    processId?: string;
    processInstanceId?: string;
    rootProcessInstanceId?: string;
    taskDocumentId?: string;
    taskId?: string;
    taskInstanceId?: string;
}

export interface IUserProperties {
    loginUserName: string;
    lastName?: string;
    firstName?: string;
    phoneticLastName?: string;
    phoneticFirstName?: string;
    zip?: string;
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    building?: string;
    mailAddress?: string;
    phone?: string;
    extension?: string;
    faceImage?: string;
    faxNumber?: string;
    language?: string;
    timezone?: string;
    displayName?: string;
    displayGlobalName?: string;
    dateFormat?: string;
    dateSeparator?: string;
    timeFormat?: string;
    userType?: string;
    aclReaders?: any[];
    aclWriters?: any[];
    loginPassword?: string;
    profiles?: IProfile[];
    profile?: {
        id?: string;
        type?: string;
        roleId?: any;
        department?: IGroupDoc;
    };
    departmentIds?: string[];
    groupIds?: any[];
    organizationIds?: string[];
    ancestorIds?: string[];
}

export interface IUserDoc {
    system: ISystem;
    properties: IUserProperties;
}

export interface IGroupDoc {
    system: ISystem;
    properties: IGroupProperties;
}
export interface IDoc<T = {}> {
    system: ISystem;
    document: {
        properties: T;
    };
}

export interface IResponseDownloadFile {
    type: string;
    url: string;
    id: string;
}

export interface IGroupProperties {
    path?: string;
    name: string;
    groupType?: 'role' | 'organization' | 'group';
    label: string;
    aclReaders?: string[];
    aclWriters?: string[];
    parent?: string;
    key?: string;
    fullLabel?: string;
    fullpath?: string;
    labelPath?: string;
    members?: IMember[];
}

export type SearchType = 'id' | 'string' | 'integer' | 'number' | 'date' | 'boolean' | 'reader' | 'writer' | 'richtext';

export type OperatorType = 'equal' | 'notequal' | 'greaterthan' |
'lessthan' | 'greaterequal' | 'lessequal' | 'contain' | 'range' | 'fulltextsearch_sentence';

export interface IRangeValue<T> {
    lower?: T;
    lowerequal?: T;
    upper?: T;
    upperequal?: T;
}

export interface ISearchForm<P, T = any> {
    ignoreCaseSense?: boolean;
    type: SearchType;
    operator: OperatorType;
    propertyName: keyof P | 'fulltextsearch_list';
    value: T | IRangeValue<T>;
}

export type SearchCondition<P> = '(' | ')' | 'and' | 'or' | ISearchForm<P>;


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
        return Moment(value).format('YYYY-MM-DDTHH:mm:ss[T]');
    } else {
        return value;
    }
};

// tslint:disable-next-line:max-classes-per-file
class ClientError extends Error {
    public data: IResponse;
    public constructor(data: IResponse) {
        super();
        this.data = data;
    }
}

export interface IDocListForView<T> {
    docList: IDocListRowForView<T>[];
    metrics: {
        totalCount: number;
    };
}

export interface IDocListRowForView<T> {
    appId: string;
    columnValues: IDocListRowColForView<T>[];
    documentId: string;
    documentKey: string;
    index: number;
    isCategory: false;
}

export interface IDocListRowColForView<T> {
    propertyName: keyof T;
    value: string | number | boolean | Date;
}

// tslint:disable-next-line:max-classes-per-file
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

    // public postForm = async (path: string,
    //     token: string[],
    //     data: { [key: string]: string },
    //     header: { [key: string]: string } = {},
    //     params?: { [key: string]: string }) => {
    //     const url = this.createUrl(path, params || {});
    //     const sendHeader = Object.assign({}, this.defaultHeader, header);
    //     sendHeader.Cookie = token.join('; ');
    //     // React Native fetch では、redirect をコントロールできない。勝手に転送されてしまうため、
    //     // set-cookie の token が取得できない
    //     const response = await sshWebClient.postForm(url, sendHeader, data, params || {});
    //     return response;
    // }

    // public login = async (userId: string, password: string): Promise<ILoginResult> => {
    //     const path = '/services/v1/login';
    //     try {
    //         const result = await this.postForm(path, [], { userName: userId, password });
    //         if (result.statusCode === 303 && !!result.tokens) {
    //             return {
    //                 result: 'success',
    //                 tokens: result.tokens,
    //             };
    //         } else {
    //             return {
    //                 result: 'failed',
    //                 tokens: [],
    //             };
    //         }
    //     } catch (e) {
    //         return {
    //             result: 'error',
    //             tokens: [],
    //         };
    //     }
    // }
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
        const response = await this.get(`/services/v1/users`, tokens);
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
