import Clone from 'clone';
import { Button, Content, List, Spinner, Text } from 'native-base';
import React, { Component } from 'react';
import { RefreshControl } from 'react-native';

import { getEimAccount } from '../account-manager/EimAccount';
import { IDocListForView, IDocListRowForView } from '../eim-service/IDocListForView';
import { IDocListSearchOption, IDocListSort, SearchCondition } from '../eim-service/IDocListSearchOption';

export type CreateRowElement<T>
    = (row: IDocListRowForView<T>, cols: T) => JSX.Element;
export interface IDocListViewProps<T> {
    appKey?: string;
    docListKey: string;
    rowCountAtOnce: number;
    rowElement: CreateRowElement<T>;
    searchCondition?: SearchCondition<T>[];
    sortCondition?: IDocListSort<T>[];
    theme: { brandPrimary: string; textColor: string };
    hide?: boolean;
    onFinishLoad?: () => void;
}

export interface IDocListViewLocalState<T> {
    docListData?: IDocListForView<T>;
    offset: number;
    onSearch: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DocListView<T = any> extends Component<IDocListViewProps<T>, IDocListViewLocalState<T>> {
    private $isMounted: boolean = false;
    public constructor(props: IDocListViewProps<T>) {
        super(props);
        this.state = {
            offset: 0,
            onSearch: false,
        };
    }
    public render = () => {
        const { docListData } = this.state;
        const list = this.createRowElement(docListData);
        const moreButton = this.createMoreButton();
        const refreshControl = <RefreshControl
            refreshing={this.state.onSearch}
            onRefresh={this.reload}
        />;
        return (
            <Content refreshControl={refreshControl}
                style={{ display: !!this.props.hide ? 'none' : 'flex' }}>
                <List>
                    {list ?
                        list :
                        <Spinner color={this.props.theme.brandPrimary} />}
                </List>
                {moreButton}
                {!!docListData && docListData.docList.length === 0
                    ? <Text style={{ color: this.props.theme.textColor }}>
                        対象の文書はありません。</Text>
                    : null}
            </Content>
        );
    }
    public componentDidMount = () => {
        this.$isMounted = true;
        // iOS では、setTimeout で setState しないとフリーズしてしまう
        setTimeout(this.loadDocList.bind(this, 0), 100);
    }
    public componentWillUnmount = () => {
        this.$isMounted = false;
    }
    public reload = () => {
        this.loadDocList(0);
    }
    private callLoadDocListData = async (props: IDocListViewProps<T>, offset: number) => {
        const searchOptions: IDocListSearchOption<T> = {
            limit: props.rowCountAtOnce,
            offset,
            search: props.searchCondition,
            sort: props.sortCondition,
        };
        const eimAccount = getEimAccount();
        return await eimAccount.getServiceAdapter().getDocListForView<T>(
            eimAccount.eimTokens,
            props.appKey || eimAccount.appKey,
            props.docListKey,
            searchOptions,
        );
    }

    private createRowElement = (docListData: IDocListForView<T> | undefined) => {
        return !docListData ? null :
            docListData.docList.map((row) => {
                const cols: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    [key: string]: any;
                } = {};
                row.columnValues.forEach((col) => {
                    cols[col.propertyName as string] = col.value;
                });
                return this.props.rowElement(row, cols as T);
            });
    }

    private createMoreButton = () => {
        const { docListData } = this.state;
        if (!docListData) { return null; }
        if (docListData.metrics.totalCount <= this.state.offset) {
            return null;
        }
        return ((this.state.onSearch) ?
            <Spinner color={this.props.theme.brandPrimary} />
            : <Button full light
                onPress={this.loadDocList.bind(this, this.state.offset)}>
                <Text>さらに表示</Text>
            </Button>);
    }

    private loadDocList = async (offset: number) => {
        if (offset === 0) {
            this.setState({
                docListData: undefined,
                onSearch: true,
            });

        } else {
            this.setState({
                onSearch: true,
            });
        }
        return this.callLoadDocListData(this.props, offset).then((result) => {
            const { state } = this;
            const docListData = Clone(result);
            if (!!state.docListData) {
                docListData.docList =
                    state.docListData.docList.concat(docListData.docList);
            }
            if (this.$isMounted) {
                this.setState({
                    docListData,
                    offset: offset + this.props.rowCountAtOnce,
                    onSearch: false,
                });
            }
            if (this.props.onFinishLoad) { this.props.onFinishLoad(); }
        }).catch(((e) => {
            this.setState({
                onSearch: false,
            });
            console.warn(e);
        }));
    }
}
