import Clone from 'clone';
import { Color } from 'csstype';
import { Button, List, Spinner, Text, View } from 'native-base';
import React, { Component } from 'react';

import eimAccount from '../account-manager/EimAccount';
import {
    IDocListForView,
    IDocListRowForView,
    IDocListSearchOption,
    IDocListSort,
    SearchCondition,
} from '../eim-service';

export type CreateRowElement<T> = (row: IDocListRowForView<T>, cols: T) => JSX.Element;
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
export class DocListView<T> extends Component<IProps<T>, ILocalState<T>> {
    private $isMounted: boolean = false;
    public constructor(props: IProps<T>) {
        super(props);
        this.state = {
            offset: 0,
            onSearch: false,
        };
    }
    public render() {
        const { docListData } = this.state;
        const list = !docListData ? null :
            docListData.docList.map((row) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cols: { [key: string]: any } = {};
                row.columnValues.forEach((col) => {
                    cols[col.propertyName as string] = col.value;
                });
                return this.props.rowElement(row, cols as T);
            });
        const moreButton = (
            (this.state.onSearch) ?
                <Spinner color={this.props.spinnerColor} />
                : <Button full light onPress={this.loadDocList.bind(this, this.state.offset)}>
                    <Text>さらに表示</Text>
                </Button>
        );
        return (
            <View>
                <List>
                    {list ? list : <Spinner color={this.props.spinnerColor} />}
                </List>
                {(!!docListData &&
                    this.state.offset < docListData.metrics.totalCount) ?
                    moreButton : null}
                {!!docListData && docListData.docList.length === 0
                    ? <Text style={{ color: this.props.noDocsTextColor }}>対象の文書はありません。</Text>
                    : null}
            </View>
        );
    }
    public componentDidMount = () => {
        this.$isMounted = true;
        this.loadDocList(0);
    }
    public componentWillUnmount = () => {
        this.$isMounted = false;
    }
    public reload = () => {
        this.loadDocList(0);
    }
    private callLoadDocListData = async (props: IProps<T>, offset: number) => {
        const searchOptions: IDocListSearchOption<T> = {
            limit: props.rowCountAtOnce,
            offset,
            search: props.searchCondition,
            sort: props.sortCondition,
        };
        return await eimAccount.getServiceAdapter().getDocListForView<T>(
            props.tokens,
            props.appKey,
            props.docListKey,
            searchOptions,
        );
    }

    private loadDocList(offset: number) {
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
        this.callLoadDocListData(this.props, offset).then((result) => {
            const { state } = this;
            const docListData = Clone(result);
            if (!!state.docListData) {
                docListData.docList = state.docListData.docList.concat(docListData.docList);
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
