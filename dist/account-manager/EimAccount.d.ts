import { EIMServiceAdapter, IUserDoc } from '../eim-service';
import { IEimAccount, IEimAccountBase } from './IEimAccount';
export declare class EimAccount implements IEimAccount {
    appKey: string;
    domain: string;
    eimTokens: string[];
    user?: IUserDoc;
    siteName: string;
    private serviceAdapter;
    constructor();
    load: () => Promise<IEimAccountBase | null>;
    save: () => Promise<void>;
    loadUser: () => Promise<void>;
    getServiceAdapter: () => EIMServiceAdapter;
    getDepartmentName(): string | null;
    clear: () => void;
}
export declare const getEimAccount: (obj?: EimAccount | undefined) => EimAccount;
