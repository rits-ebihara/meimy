import { IResponse } from './IResponse';

export class ClientError extends Error {
    public data: IResponse;
    public constructor(data: IResponse) {
        super();
        this.data = data;
    }
}
