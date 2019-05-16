import { IResponse } from './IResponse';
export declare class ClientError extends Error {
    data: IResponse;
    constructor(data: IResponse);
}
