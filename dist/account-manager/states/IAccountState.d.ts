export declare type AuthType = 'password' | 'o365';
export interface IAccountState {
    authType: AuthType;
    eimToken: string[];
    id: string | null;
    lastConnect: Date | null;
    siteDomain: string;
    siteName: string;
    userId?: string;
    password?: string;
}
export declare const createInitAccountState: () => IAccountState;
