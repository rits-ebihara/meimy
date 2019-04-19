type AuthType = 'password' | 'o365';
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

export const createInitAccountState = (): IAccountState => {
    return {
        authType: 'o365',
        eimToken: [],
        id: null,
        lastConnect: null,
        siteDomain: '',
        siteName: '',
    };
};
