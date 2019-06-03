export type ColValueType = string | number | boolean | Date;
export interface IDocListRowColForView<T> {
    propertyName: keyof T;
    value: ColValueType;
}

export interface IDocListRowForView<T> {
    appId: string;
    columnValues: IDocListRowColForView<T>[];
    documentId: string;
    documentKey: string;
    index: number;
    isCategory: false;
}

export interface IDocListForView<T> {
    docList: IDocListRowForView<T>[];
    metrics: {
        totalCount: number;
    };
}

