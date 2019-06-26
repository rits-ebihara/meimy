import Enzyme, { shallow, ShallowWrapper } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { ListItem, Text } from 'native-base';
import React from 'react';
import { mocked } from 'ts-jest/utils';

import { getEimAccount } from '../../src/account-manager/EimAccount';
import {
    CreateRowElement,
    DocListView,
    IDocListViewLocalState,
    IDocListViewProps,
} from '../../src/components/DocListView';
import { IDocListForView } from '../../src/eim-service/IDocListForView';

Enzyme.configure({ adapter: new EnzymeAdapter() });

interface IDummyList {
    col1: string;
    col2: number;
}

const createDocList = (): IDocListForView<IDummyList> => ({
    docList: [{
        appId: 'app001',
        columnValues: [
            {
                propertyName: 'col1',
                value: 'hoge001',
            },
            {
                propertyName: 'col2',
                value: 0,
            },
        ],
        documentId: 'doc001',
        documentKey: 'doc001-key',
        index: 0,
        isCategory: false,
    }],
    metrics: {
        totalCount: 10,
    },
});

jest.mock('../../src/account-manager/EimAccount', () => ({
    getEimAccount: jest.fn().mockReturnValue({
        appKey: 'app-key',
        domain: 'site-domain',
        eimTokens: ['token-01'],
        siteName: 'site-name',
        getServiceAdapter: () => ({
            getDocListForView: jest.fn(
                async (): Promise<IDocListForView<IDummyList>> => ({
                    docList: [],
                    metrics: {
                        totalCount: 0,
                    },
                })),
        }),
    }),
}));


const rowElement: CreateRowElement<IDummyList> = (row, cols) => (
    <ListItem key={row.documentId}>
        <Text>{cols.col1}</Text>
    </ListItem>
);

const createProps = (): IDocListViewProps<IDummyList> => ({
    docListKey: 'doc-list-key',
    rowCountAtOnce: 30,
    rowElement,
    theme: {
        brandPrimary: '#aaa',
        textColor: '#fff',
    },
});

describe('render', () => {
    let props: IDocListViewProps<IDummyList>;
    let wrapper: ShallowWrapper<IDocListViewProps<IDummyList>,
    IDocListViewLocalState<IDummyList>, DocListView<IDummyList>>;
    let instance: DocListView<IDummyList>;
    beforeEach(() => {
        props = createProps();
        wrapper = shallow<DocListView>(
            <DocListView {...props} />, { disableLifecycleMethods: true });
        instance = wrapper.instance();
    });
    test('init', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state()).toEqual({
            offset: 0, onSearch: false,
        });
        expect(instance['$isMounted']).toEqual(false);
        // componentDidMount
        const fn = instance['loadDocList'] = jest.fn();
        instance.componentDidMount();
        expect(fn).toBeCalled();
        expect(instance['$isMounted']).toEqual(true);
        // componentWillUnmount
        instance.componentWillUnmount();
        expect(instance['$isMounted']).toEqual(false);
    });
    test('empty', () => {
        wrapper.setState({
            docListData: {
                docList: [],
                metrics: { totalCount: 0 },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('loading', () => {
        wrapper.setState({
            onSearch: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('list exist', () => {
        wrapper.setState({
            docListData: createDocList(),
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('hide', () => {
        props = createProps();
        props.hide = true;
        wrapper = shallow<DocListView>(
            <DocListView {...props} />, { disableLifecycleMethods: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('reload', () => {
    test('reload', () => {
        const props = createProps();
        const wrapper = shallow<DocListView>(<DocListView {...props} />, { disableLifecycleMethods: true });
        const instance = wrapper.instance();
        instance['loadDocList'] = jest.fn();
        instance.reload();
        expect(instance['loadDocList']).toBeCalledWith(0);
    })
})


describe('loadDocList', () => {
    let props: IDocListViewProps<IDummyList>;
    let wrapper: ShallowWrapper<IDocListViewProps<IDummyList>,
    IDocListViewLocalState<IDummyList>, DocListView<IDummyList>>;
    let instance: DocListView<IDummyList>;
    beforeEach(() => {
        mocked(getEimAccount).mockClear();
        props = createProps();
        wrapper = shallow<DocListView>(<DocListView {...props} />, { disableLifecycleMethods: true });
        instance = wrapper.instance();
    });
    test('offset = 0', async () => {
        mocked(getEimAccount).mockReturnValue({
            appKey: 'app-key',
            domain: 'site-domain',
            eimTokens: ['token-01'],
            siteName: 'site-name',
            getServiceAdapter: () => {
                return {
                    getDocListForView: async () => {
                        return createDocList() as any;
                    },
                } as any;
            },
        } as any);
        // アンマウント状態だと更新しない。
        instance['$isMounted'] = false;
        wrapper.setState({
            docListData: createDocList(),
        });
        await instance['loadDocList'](0);
        const state = wrapper.state();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(state.docListData).toBeUndefined();

        // マウント状態だと更新する。
        instance['$isMounted'] = true;
        wrapper.setState({
            docListData: createDocList(),
        });
        await instance['loadDocList'](0);
        const state2 = wrapper.state();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(state2.docListData!.docList.length).toEqual(1);
    });
    test('offset = 1', async () => {
        props = createProps();
        props.onFinishLoad = jest.fn();
        wrapper = shallow<DocListView>(<DocListView {...props} />, { disableLifecycleMethods: true });
        instance = wrapper.instance();

        mocked(getEimAccount).mockReturnValue({
            appKey: 'app-key',
            domain: 'site-domain',
            eimTokens: ['token-01'],
            siteName: 'site-name',
            getServiceAdapter: () => {
                return {
                    getDocListForView: async () => {
                        return createDocList() as any;
                    },
                } as any;
            },
        } as any);
        // offset が 1 以上の場合は、データをスタックする
        instance['$isMounted'] = true;
        wrapper.setState({
            docListData: createDocList(),
        });
        await instance['loadDocList'](1);
        const state = wrapper.state();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(state.docListData!.docList.length).toEqual(2);
        expect(props.onFinishLoad).toBeCalled();
    });
    test('onError', async () => {
        props = createProps();
        props.onFinishLoad = jest.fn();
        wrapper = shallow<DocListView>(<DocListView {...props} />, { disableLifecycleMethods: true });
        instance = wrapper.instance();

        mocked(getEimAccount).mockReturnValue({
            appKey: 'app-key',
            domain: 'site-domain',
            eimTokens: ['token-01'],
            siteName: 'site-name',
            getServiceAdapter: () => {
                return {
                    getDocListForView: async () => {
                        throw new Error();
                    },
                } as any;
            },
        } as any);
        // offset が 1 以上の場合は、データをスタックする
        instance['$isMounted'] = true;
        wrapper.setState({
            docListData: createDocList(),
        });
        await instance['loadDocList'](1);
        const state = wrapper.state();
        expect(state.onSearch).toEqual(false);
    });
});
