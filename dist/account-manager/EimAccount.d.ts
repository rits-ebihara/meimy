import { EIMServiceAdapter, IUserDoc } from '../eim-service';
import { IEimAccount } from './IEimAccount';
declare class EimAccount implements IEimAccount {
    appKey: string;
    domain: string;
    eimTokens: string[];
    user?: IUserDoc;
    siteName: string;
    private serviceAdapter;
    constructor();
    load: () => Promise<IEimAccount | null>;
    save: () => Promise<void>;
    loadUser: () => Promise<void>;
    getServiceAdapter: () => EIMServiceAdapter;
    getDepartmentName(): string | null;
    clear: () => void;
}
declare const eimAccount: EimAccount;
export default eimAccount;
