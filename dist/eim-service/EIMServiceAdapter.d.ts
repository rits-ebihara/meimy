import { IDoc, IGroupDoc, IUserDoc } from './EIMDocInterface';
import { IDocListForView, IDocListRowColForView } from './IDocListForView';
import { IDocListSearchOption } from './IDocListSearchOption';
import { ILangResources } from './ILangResources';
import { IParsedResponse, IResponse } from './IResponse';
import { IResponseDownloadFile } from './IResponseDownloadFile';
export declare const dateParser: (_key: string, value: any) => any;
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
    validateToken: (tokens: string[]) => Promise<boolean>;
    getAppList: (tokens: string[]) => Promise<IResponse>;
    getDocListForView: <T = any>(tokens: string[], appKey: string, docListKey: string, options?: IDocListSearchOption<T> | undefined) => Promise<IDocListForView<T>>;
    getDocumentById: <T>(tokens: string[], docId: string) => Promise<IParsedResponse<IDoc<T>>>;
    getUserDocById: (tokens: string[], userId: string) => Promise<IParsedResponse<IUserDoc>>;
    getGroupDocById: (tokens: string[], groupId: string) => Promise<IParsedResponse<IGroupDoc>>;
    getAttachmentFile: (tokens: string[], fileId: string) => Promise<IResponseDownloadFile>;
    getLoginUser: (tokens: string[]) => Promise<IUserDoc | null>;
    executeScript: (tokens: string[], appId: string, fileName: string, data: object, async?: boolean) => Promise<IResponse>;
    getLangResource: (tokens: string[], appId: string) => Promise<ILangResources>;
    private createResponse;
    private createUrl;
}
export declare const getDocListValue: <T = any>(columnValues: IDocListRowColForView<T>[], propName: keyof T) => string | number | boolean | Date | undefined;
