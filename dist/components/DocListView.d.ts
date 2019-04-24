import { Color } from 'csstype';
import { Component } from 'react';
import { IDocListForView, IDocListRowForView, IDocListSort, SearchCondition } from '../eim-service';
export declare type CreateRowElement<T> = (row: IDocListRowForView<T>, cols: T) => JSX.Element;
interface IProps<T> {
    appKey: string;
    docListKey: string;
    domain: string;
    noDocsTextColor: Color;
    rowCountAtOnce: number;
    rowElement: CreateRowElement<T>;
    searchCondition?: SearchCondition<T>[];
    sortCondition?: IDocListSort<T>[];
    spinnerColor: Color;
    tokens: string[];
    onFinishLoad?: () => void;
}
interface ILocalState<T> {
    docListData?: IDocListForView<T>;
    offset: number;
    onSearch: boolean;
}
export declare class DocListView<T> extends Component<IProps<T>, ILocalState<T>> {
    private $isMounted;
    constructor(props: IProps<T>);
    render(): JSX.Element;
    componentDidMount: () => void;
    componentWillUnmount: () => void;
    reload: () => void;
    private callLoadDocListData;
    private loadDocList;
}
export {};
