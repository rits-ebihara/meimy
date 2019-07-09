import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { Toast } from 'native-base';
import React from 'react';

import { createLoadAppListAction, createSetAppListAction } from '../../../../account-manager/actions/EimAppListActions';
import NavigateActions from '../../../../account-manager/actions/NavigateActions';
import IEimAppList, { IEimApp } from '../../../../account-manager/states/IEimAppListState';
import { __private__ } from '../../../../account-manager/views/containers/EimAppList';
import { ICombinedNavProps } from '../../../../redux-helper/redux-helper';

Enzyme.configure({ adapter: new EnzymeAdapter() });


jest.mock('native-base', () => ({
    ...jest.requireActual('native-base'),
    Toast: {
        show: jest.fn(),
    }
}));
jest.mock('../../../../account-manager/actions/EimAppListActions', () => {
    return {
        createLoadAppListAction: jest.fn(),
        createSetAppListAction: jest.fn(),
    }
});

jest.mock('../../../../account-manager/actions/NavigateActions', () => {
    return {
        openApp: jest.fn(),
    };
});

const getProps = (): ICombinedNavProps<IEimAppList> => {
    return {
        dispatch: jest.fn(),
        navigation: {
            pop: jest.fn(),
        } as any,
        state: {
            appList: [],
            loading: false,
        },
    };
};

const createAppList = (): IEimApp[] => {
    return [
        {
            appKey: 'appkey001',
            appName: 'app001',
            description: 'app001-desc',
            siteDomain: 'site-domain-001',
            siteName: 'site001',
            tokens: ['abc', 'def'],
        },
        {
            appKey: 'appkey002',
            appName: 'app002',
            description: 'app002-desc',
            siteDomain: 'site-domain-002',
            siteName: 'site002',
            tokens: ['abc', 'def'],
        },
    ];
};

describe('init', () => {
    test('empty list', () => {
        const props = getProps();
        const wrapper = shallow(<__private__.EimAppList {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(createLoadAppListAction).toBeCalled();
        expect(createSetAppListAction).not.toBeCalled();
    });
    test('exist list', () => {
        const props = getProps();
        props.state.appList = createAppList();
        const wrapper = shallow(<__private__.EimAppList {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    test('loading', () => {
        const props = getProps();
        props.state.appList = createAppList();
        props.state.loading = true;
        const wrapper = shallow(<__private__.EimAppList {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('events', () => {
    let wrapper: Enzyme.ShallowWrapper;
    let instance: any;
    let props: ICombinedNavProps<IEimAppList>;
    beforeEach(() => {
        props = getProps();
        wrapper = shallow(<__private__.EimAppList {...props} />);
        instance = wrapper.instance() as any;
    });
    test('press row item', () => {
        instance['onPressItem']('app001');
        expect(NavigateActions.openApp).toBeCalled();
    });
    test('network error handler', () => {
        instance['onNetworkError']();
        expect(Toast.show).toBeCalledWith({
            text: 'ネットワークエラーが発生しました。',
            type: 'warning',
        });
        expect(createSetAppListAction).toBeCalledWith([]);
        expect(props.dispatch).toBeCalled();
    });
    test('on press back button', () => {
        const result = instance['onPressBackButton']();
        expect(props.navigation.pop).toBeCalled();
        expect(result).toBeTruthy();
    });
})

describe('navigationOptions', () => {
    test('', () => {
        const options = __private__.EimAppList.navigationOptions();
        expect(options).toEqual({
            headerStyle: {
                backgroundColor: '#162756',
            },
            headerTintColor: '#fff',
            headerTitle: 'アプリ一覧',
        });
    })
});

describe('mapStateToProps', () => {
    test('', () => {
        const state = {
            appList: createAppList(),
        };
        const result = __private__.mapStateToProps(state as any);
        expect(result).toStrictEqual({
            state: state.appList,
        });
    });
});
