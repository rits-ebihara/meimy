export interface IEimApp {
    appKey: string;
    appName: string;
    description: string;
    siteDomain: string;
    siteName: string;
    tokens: string[];
}

export default interface IEimAppList {
    appList: IEimApp[];
    loading: boolean;
};;;;;;;;;;

export const createInitEimAppList = (): IEimAppList => {
    return {
        appList: [],
        loading: false,
    };
};
