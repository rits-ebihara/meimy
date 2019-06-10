import { Component } from 'react';
import { IDocListForView, IDocListRowForView } from '../eim-service/IDocListForView';
import { IDocListSort, SearchCondition } from '../eim-service/IDocListSearchOption';
export declare type CreateRowElement<T> = (row: IDocListRowForView<T>, cols: T) => JSX.Element;
interface IProps<T> {
    appKey?: string;
    docListKey: string;
    rowCountAtOnce: number;
    rowElement: CreateRowElement<T>;
    searchCondition?: SearchCondition<T>[];
    sortCondition?: IDocListSort<T>[];
    theme: {
        brandPrimary: string;
        textColor: string;
    };
    hide?: boolean;
    onFinishLoad?: () => void;
}
interface ILocalState<T> {
    docListData?: IDocListForView<T>;
    offset: number;
    onSearch: boolean;
}
export declare class DocListView<T = any> extends Component<IProps<T>, ILocalState<T>> {
    private $isMounted;
    constructor(props: IProps<T>);
    render: () => JSX.Element;
    componentDidMount: () => void;
    componentWillUnmount: () => void;
    reload: () => void;
    private callLoadDocListData;
    private createRowElement;
    private createMoreButton;
    private loadDocList;
}
export {};
