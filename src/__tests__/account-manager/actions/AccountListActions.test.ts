import { getGenericPassword } from 'react-native-keychain';
import { mocked } from 'ts-jest/utils';

import {
    asyncLoadAccountListAfterShow,
    createSetAuthState,
    SET_AUTH_STATE,
    SHOW_ACCOUNT_LIST,
} from '../../../account-manager/actions/AccountListActions';
import { IAccountListState } from '../../../account-manager/states/IAccountLisState';
import { IAccountState } from '../../../account-manager/states/IAccountState';

const existAccounts: IAccountState[] = [{
    authType: 'password',
    eimToken: ['token'],
    id: 'account-id',
    lastConnect: new Date(1557365371768),
    password: 'pass',
    siteDomain: 'site-domain',
    siteName: 'site-name',
    userId: 'user-id',
},
{
    authType: 'password',
    eimToken: ['token2'],
    id: 'account-id2',
    lastConnect: new Date(1557361000000),
    password: 'pass2',
    siteDomain: 'site-domain2',
    siteName: 'site-name2',
    userId: 'user-id2',
}];

const existAuthState = {
    appKey: 'app-key',
    appKeyPrefix: 'app-key-prefix',
    mobileAppKey: 'm-app-key',
    siteDomain: 'site-domain',
    siteName: 'site-name',
    tokens: ['t001'],
    link: 'link',
}

jest.mock('react-native-keychain', () => {
    return {
        setGenericPassword: jest.fn(),
        getGenericPassword: jest.fn(async () => { return false }),
    }
});

describe('asyncLoadAccountListAfterShow', () => {
    test('success', async () => {
        const dispatch = jest.fn();
        const data: IAccountListState = {
            accounts: existAccounts,
            authState: existAuthState,
        }
        mocked(getGenericPassword).mockImplementation(async () => {
            return {
                service: 'test-service-name',
                username: 'dummy',
                password: JSON.stringify(data),
            }
        });
        await asyncLoadAccountListAfterShow(dispatch);
        expect(dispatch).toBeCalledWith({ accountList: data, type: SHOW_ACCOUNT_LIST });
    });
    test('unexcepted data', async () => {
        const dispatch = jest.fn();
        mocked(getGenericPassword).mockImplementation(async () => {
            return {
                service: 'test-service-name',
                username: 'dummy',
                password: JSON.stringify({}),
            };
        });
        await asyncLoadAccountListAfterShow(dispatch);
        expect(dispatch).toBeCalledWith({
            accountList: {
                accounts: [],
                authState: {},
            },
            type: SHOW_ACCOUNT_LIST
        });
    });

    test('not exist', async () => {
        const dispatch = jest.fn();
        mocked(getGenericPassword).mockImplementation(async () => {
            return false;
        });
        await asyncLoadAccountListAfterShow(dispatch);
        expect(dispatch).toBeCalledWith({
            accountList: {
                accounts: [],
                authState: {},
            },
            type: SHOW_ACCOUNT_LIST
        });
    });
});

test('createSetAuthState', () => {
    const action = createSetAuthState(existAuthState);
    expect(action).toEqual({
        authState: existAuthState,
        type: SET_AUTH_STATE
    });
});
