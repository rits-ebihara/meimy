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
}
export declare const createInitEimAppList: () => IEimAppList;
