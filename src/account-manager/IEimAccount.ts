import { EIMServiceAdapter } from '../eim-service/EIMServiceAdapter';

export interface IEimAccountBase {
    appKey: string;
    domain: string;
    eimTokens: string[];
    siteName: string;
}

export interface IEimAccountController {
    load: () => Promise<IEimAccountBase | null>;
    save: () => Promise<void>;
    loadUser: () => Promise<void>;
    getServiceAdapter: () => EIMServiceAdapter;
    getDepartmentName: () => string | null;
    clear: () => void;
}

export interface IEimAccount extends IEimAccountBase, IEimAccountController { }

export interface IAuthAppQuery {
    appkey?: string;
    appprefix: string;
    domain?: string;
    link?: string;
    mapp: string;
}
