export declare type SearchType = 'id' | 'string' | 'integer' | 'number' | 'date' | 'boolean' | 'reader' | 'writer' | 'richtext';
export declare type OperatorType = 'equal' | 'notequal' | 'greaterthan' | 'lessthan' | 'greaterequal' | 'lessequal' | 'contain' | 'range' | 'fulltextsearch_sentence';
export interface IRangeValue<T> {
    lower?: T;
    lowerequal?: T;
    upper?: T;
    upperequal?: T;
}
export interface ISearchForm<P, T = any> {
    ignoreCaseSense?: boolean;
    type: SearchType;
    operator: OperatorType;
    propertyName: keyof P | 'fulltextsearch_list';
    value: T | IRangeValue<T>;
}
export declare type SearchCondition<P> = '(' | ')' | 'and' | 'or' | ISearchForm<P>;
export interface IDocListSort<T> {
    propertyName: keyof T;
    direction?: 'Ascending' | 'Descending';
}
export interface IDocListSearchOption<P> {
    offset: number;
    limit: number;
    search?: SearchCondition<P>[];
    sort?: IDocListSort<P>[];
}
