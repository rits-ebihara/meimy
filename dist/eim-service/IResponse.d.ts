export interface IResponse {
    body: string;
    statusCode: number;
    contentType: string;
    tokens: string[];
    headers: {
        [key: string]: string;
    };
}
export interface IParsedResponse<T> extends IResponse {
    parsedBody?: T;
}
