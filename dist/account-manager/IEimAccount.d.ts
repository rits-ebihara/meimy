export interface IEimAccountBase {
    appKey: string;
    domain: string;
    eimTokens: string[];
    siteName: string;
}
export interface IEimAccountController {
    load: () => Promise<IEimAccountBase | null>;
    save: () => Promise<void>;
}
export interface IEimAccount extends IEimAccountBase, IEimAccountController {
}
export interface IAuthAppQuery {
    appkey?: string;
    appprefix: string;
    domain?: string;
    link?: string;
    mapp: string;
}
