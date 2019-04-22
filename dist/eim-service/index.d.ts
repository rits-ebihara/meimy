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
export declare type SearchType = 'id' | 'string' | 'integer' | 'number' | 'date' | 'boolean' | 'reader' | 'writer' | 'richtext';
export declare type OperatorType = 'equal' | 'notequal' | 'greaterthan' | 'lessthan' | 'greaterequal' | 'lessequal' | 'contain' | 'range' | 'fulltextsearch_sentence';
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
export declare type SearchCondition<P> = '(' | ')' | 'and' | 'or' | ISearchForm<P>;
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
export declare class EIMServiceAdapter {
    private baseUrl;
    private defaultHeader;
    constructor(domain: string);
    get: (path: string, token: string[], header?: {
        [key: string]: string;
    } | undefined, params?: {
        [key: string]: string;
    } | undefined) => Promise<IResponse>;
    post: (path: string, token: string[], data: {
        [key: string]: any;
    }, header?: {
        [key: string]: string;
    }, params?: {
        [key: string]: string;
    } | undefined) => Promise<IResponse>;
    postForm: (path: string, token: string[], data: {
        [key: string]: string;
    }, header?: {
        [key: string]: string;
    }, params?: {
        [key: string]: string;
    } | undefined) => Promise<IResponse>;
    login: (userId: string, password: string) => Promise<ILoginResult>;
    validateToken: (tokens: string[]) => Promise<boolean>;
    getAppList: (tokens: string[]) => Promise<IResponse>;
    getDocListForView: <T = any>(tokens: string[], appKey: string, docListKey: string, options?: IDocListSearchOption<T> | undefined) => Promise<IDocListForView<T>>;
    getDocumentById: <T>(tokens: string[], docId: string) => Promise<IParsedResponse<IDoc<T>>>;
    getUserDocById: (tokens: string[], userId: string) => Promise<IParsedResponse<IUserDoc>>;
    getGroupDocById: (tokens: string[], groupId: string) => Promise<{}>;
    getAttachmentFile: (tokens: string[], fileId: string) => Promise<IResponseDownloadFile>;
    getLoginUser: (tokens: string[]) => Promise<IUserDoc | null>;
    executeScript: (tokens: string[], appId: string, fileName: string, data: object, async?: boolean) => Promise<IResponse>;
    private createResponse;
    private createUrl;
}
