import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from 'react';
import { mocked } from 'ts-jest/utils';

import { SET_ACCOUNT_ACTION } from '../../../../account-manager/actions/AccountActions';
import { asyncLoadAccountListAfterShow } from '../../../../account-manager/actions/AccountListActions';
import navigateController from '../../../../account-manager/actions/NavigateActions';
import { IAccountListState } from '../../../../account-manager/states/IAccountLisState';
import { IAccountState } from '../../../../account-manager/states/IAccountState';
import { IAuthState } from '../../../../account-manager/states/IAuthStates';
import { __private__, _AccountList } from '../../../../account-manager/views/containers/AccountList';
import { ICombinedNavProps } from '../../../../redux-helper/redux-helper';

Enzyme.configure({ adapter: new EnzymeAdapter() });

jest.mock('../../../../account-manager/actions/AccountListActions.ts');

jest.mock('../../../../account-manager/actions/NavigateActions.ts');

const getProp = (): ICombinedNavProps<IAccountListState> => {
    return {
        navigation: {
            setParams: jest.fn(),
            pop: jest.fn(),
            navigate: jest.fn(),
            push: jest.fn(),
        } as any,
        dispatch: jest.fn(),
        state: {
            accounts: [],
            authState: {
                appKey: 'app-key',
                appKeyPrefix: 'app-prefix',
                mobileAppKey: 'app-m-key',
                siteDomain: 'site-domain',
                siteName: 'site-name',
                tokens: ['token'],
            },
        },
    };
};

const getAccountList = (): IAccountState[] => {
    return [
        {
            authType: 'password',
            eimToken: [],
            id: 'a001',
            lastConnect: null,
            siteDomain: 'site-domain',
            siteName: 'site-name',
        },
        {
            authType: 'password',
            eimToken: [],
            id: 'a002',
            lastConnect: null,
            siteDomain: 'site-domain2',
            siteName: 'site-name2',
        },
    ];
};

describe('init', () => {
    beforeEach(() => {
        mocked(asyncLoadAccountListAfterShow).mockClear();
    })
    test('blank list', async () => {
        const props = getProp();
        const wrapper = Enzyme.shallow(<_AccountList {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(asyncLoadAccountListAfterShow).toBeCalled();
        // expect(_AccountList.prototype['transferPage']).toBeCalled();
    });
    test('exist list', async () => {
        const props = getProp();
        props.state.accounts = getAccountList();
        props.state.accounts.push({
            authType: 'password',
            eimToken: [],
            id: null,
            lastConnect: null,
            siteDomain: 'site-domain2',
            siteName: 'site-name2',
        });
        const wrapper = Enzyme.shallow(<_AccountList {...props} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('events', () => {
    beforeEach(() => {
    });
    test('onPressListItem', () => {
        const props = getProp();
        props.state.accounts = getAccountList();
        const wrapper = Enzyme.shallow(<_AccountList {...props} />);
        const listItem = wrapper.findWhere(a => a.key() === 'a001');
        listItem.simulate('press');
        expect(props.dispatch).toBeCalledWith({
            account: props.state.accounts[0],
            type: SET_ACCOUNT_ACTION,
        });
        expect(props.navigation.push).toBeCalledWith('accountPage');
    });
    test('onPressListItem', () => {
        const props = getProp();
        props.state.accounts = getAccountList();
        const wrapper = Enzyme.shallow(<_AccountList {...props} />);
        const addButton = wrapper.findWhere(a => a.key() === 'add_button');
        addButton.simulate('press');
        expect(props.dispatch).toBeCalledWith({
            account: {
                authType: 'o365',
                eimToken: [],
                id: null,
                lastConnect: null,
                siteDomain: '',
                siteName: '',
            },
            type: SET_ACCOUNT_ACTION,
        });
        expect(props.navigation.push).toBeCalledWith('accountPage');
    });
});

describe('transferPage', () => {
    beforeEach(() => {
        mocked(navigateController.navigateForLink).mockClear();
    })
    test('', async () => {
        const props = getProp();
        props.state.accounts = getAccountList();
        const wrapper = Enzyme.shallow(<_AccountList {...props} />);
        const instance = wrapper.instance() as _AccountList;
        const authState: IAuthState = {
            appKey: 'app-key',
            appKeyPrefix: 'app-prefix',
            mobileAppKey: 'app-m-key',
            siteDomain: 'site-domain',
            siteName: 'site-name',
            tokens: ['token'],
        };
        await instance['transferPage'](authState);
        expect(navigateController.navigateForLink).toBeCalled();
    });
});

describe('mapStateToProps', () => {
    test('', () => {
        const state = {
            accountList: getAccountList(),
            prop1: 'a',
            prop2: 'b',
        };
        const result = __private__.mapStateToProps(state as any);
        expect(result).toStrictEqual({
            state: state.accountList,
        });
    });
});

describe('navigationOptions', () => {
    test('', () => {
        const options = _AccountList.navigationOptions();
        expect(options).toEqual({
            headerStyle: {
                backgroundColor: '#162756',
            },
            headerTintColor: '#fff',
            headerTitle: 'EIMサイト一覧',
        });
    })
});
