import { Alert } from 'react-native';
import { getGenericPassword, setGenericPassword } from 'react-native-keychain';
import { mocked } from 'ts-jest/utils';

import {
    asyncRemoveAccountAction,
    asyncSaveAccountAction,
    createSetAccountAction,
    SET_ACCOUNT_ACTION,
} from '../../../account-manager/actions/AccountActions';
import { asyncLoadAccountListAfterShow } from '../../../account-manager/actions/AccountListActions';
import { IAccountState } from '../../../account-manager/states/IAccountState';

jest.mock('react-native-keychain', () => {
    return {
        setGenericPassword: jest.fn(),
        getGenericPassword: jest.fn(async () => { return false }),
    }
});
jest.mock('../../../account-manager/actions/AccountListActions');
jest.mock('../../../account-manager/Config', () => {
    return {
        getConfig: jest.fn(() => {
            return {
                accountListServiceName: 'test-service-name',
            }
        }),
    };
});
jest.mock('react-native', () => {
    return {
        Alert: {
            alert: jest.fn(),
        },
    };
});

test('createSetAccountAction', () => {
    const account: IAccountState = {
        authType: 'password',
        eimToken: [],
        id: 'a',
        lastConnect: new Date(),
        siteDomain: 'domain',
        siteName: 'site-name',
    };
    const action = createSetAccountAction(account);
    expect(action).toEqual({
        account,
        type: SET_ACCOUNT_ACTION,
    });
});

const existAccounts = [{
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
const createMockFn = () => {
    const saveFn = jest.fn(async () => { return true; });
    const loadActionListFn = jest.fn(async () => { });
    return {
        saveFn,
        loadActionListFn,
    };
};

describe('asyncSaveAccountAction', () => {
    test('pattern 1: no exist saved account', async () => {
        const mockFn = createMockFn();
        mocked(getGenericPassword).mockImplementation(async () => {
            return false;
        });
        mocked(setGenericPassword).mockImplementation(mockFn.saveFn);
        mocked(asyncLoadAccountListAfterShow).mockImplementation(mockFn.loadActionListFn);
        const account: IAccountState = {
            authType: 'password',
            eimToken: ['token'],
            id: 'account-id',
            lastConnect: new Date(1557365371768),
            password: 'pass',
            siteDomain: 'site-domain',
            siteName: 'site-name',
            userId: 'user-id',
        };
        await asyncSaveAccountAction(account, jest.fn());
        // setGenericPassword で正しいオブジェクトが渡っているか
        expect(mockFn.saveFn).toBeCalled();
        const expectSavedString = JSON.stringify({
            accounts: [account],
            authState: {},
        });
        expect(mockFn.saveFn).toBeCalledWith('dummy', expectSavedString,
            { 'service': 'test-service-name' });
        expect(mockFn.loadActionListFn).toBeCalled();
    });
    test('pattern 2: exist saved same account', async () => {
        const mockFn = createMockFn();
        mocked(getGenericPassword).mockImplementation(async () => {
            return {
                service: 'test-service-name',
                username: 'dummy',
                password: JSON.stringify(
                    {
                        accounts: existAccounts,
                        authState: {},
                    },
                ),
            }
        });
        mocked(setGenericPassword).mockImplementation(mockFn.saveFn);
        mocked(asyncLoadAccountListAfterShow).mockImplementation(mockFn.loadActionListFn);
        const account: IAccountState = {
            authType: 'o365',
            eimToken: ['token1'],
            id: 'account-id',
            lastConnect: new Date(1557367887557),
            password: 'pass1',
            siteDomain: 'site-domain1',
            siteName: 'site-name1',
            userId: 'user-id1',
        };
        await asyncSaveAccountAction(account, jest.fn());
        // setGenericPassword で正しいオブジェクトが渡っているか
        expect(mockFn.saveFn).toBeCalled();
        const expectSavedString = JSON.stringify({
            accounts: [account, existAccounts[1]],
            authState: {},
        });
        expect(mockFn.saveFn).toBeCalledWith('dummy', expectSavedString,
            { 'service': 'test-service-name' });
        expect(mockFn.loadActionListFn).toBeCalled();
    });
    test('pattern 3: exist saved other account', async () => {
        const mockFn = createMockFn();
        mocked(getGenericPassword).mockImplementation(async () => {
            return {
                service: 'test-service-name',
                username: 'dummy',
                password: JSON.stringify(
                    {
                        accounts: existAccounts,
                        authState: {},
                    },
                ),
            }
        });
        mocked(setGenericPassword).mockImplementation(mockFn.saveFn);
        mocked(asyncLoadAccountListAfterShow).mockImplementation(mockFn.loadActionListFn);
        const account: IAccountState = {
            authType: 'o365',
            eimToken: ['token1'],
            id: 'account-id3',
            lastConnect: new Date(1557367887557),
            password: 'pass1',
            siteDomain: 'site-domain1',
            siteName: 'site-name1',
            userId: 'user-id1',
        };
        await asyncSaveAccountAction(account, jest.fn());
        // setGenericPassword で正しいオブジェクトが渡っているか
        expect(mockFn.saveFn).toBeCalled();
        const expectSavedString = JSON.stringify({
            accounts: [...existAccounts, account],
            authState: {},
        });
        expect(mockFn.saveFn).toBeCalledWith('dummy', expectSavedString,
            { 'service': 'test-service-name' });
        expect(mockFn.loadActionListFn).toBeCalled();
    });
    test('pattern 3: exist saved other account', async () => {
        const mockFn = createMockFn();
        mocked(getGenericPassword).mockImplementation(async () => {
            return {
                service: 'test-service-name',
                username: 'dummy',
                password: JSON.stringify(
                    {
                        accounts: existAccounts,
                        authState: {},
                    },
                ),
            }
        });
        mocked(setGenericPassword).mockImplementation(mockFn.saveFn);
        mocked(asyncLoadAccountListAfterShow).mockImplementation(mockFn.loadActionListFn);
        const account: IAccountState = {
            authType: 'o365',
            eimToken: ['token1'],
            id: 'account-id3',
            lastConnect: new Date(1557367887557),
            password: 'pass1',
            siteDomain: 'site-domain1',
            siteName: 'site-name1',
            userId: 'user-id1',
        };
        await asyncSaveAccountAction(account, jest.fn());
        // setGenericPassword で正しいオブジェクトが渡っているか
        expect(mockFn.saveFn).toBeCalled();
        const expectSavedString = JSON.stringify({
            accounts: [...existAccounts, account],
            authState: {},
        });
        expect(mockFn.saveFn).toBeCalledWith('dummy', expectSavedString,
            { 'service': 'test-service-name' });
        expect(mockFn.loadActionListFn).toBeCalled();
    });
    test('throw', async () => {
        mocked(getGenericPassword).mockImplementation(async () => {
            throw new Error('テスト 明示的なエラー');
        });
        const fn = jest.fn();
        mocked(Alert.alert).mockImplementation(fn);
        const account: IAccountState = {
            authType: 'o365',
            eimToken: ['token1'],
            id: 'account-id3',
            lastConnect: new Date(1557367887557),
            password: 'pass1',
            siteDomain: 'site-domain1',
            siteName: 'site-name1',
            userId: 'user-id1',
        };
        await asyncSaveAccountAction(account, jest.fn());
        expect(fn).toBeCalled();
    });
});

describe('asyncRemoveAccountAction', () => {
    test('exist id', async () => {
        mocked(getGenericPassword).mockImplementation(async () => {
            return {
                service: 'test-service-name',
                username: 'dummy',
                password: JSON.stringify(
                    {
                        accounts: existAccounts,
                        authState: {},
                    },
                ),
            }
        });
        const mockFn = createMockFn();
        mocked(asyncLoadAccountListAfterShow).mockImplementation(mockFn.loadActionListFn);
        mocked(setGenericPassword).mockImplementation(mockFn.saveFn);
        const fn = jest.fn();
        await asyncRemoveAccountAction('account-id', jest.fn(), fn);
        expect(mockFn.saveFn).toBeCalled();
        const expectAccountList = {
            accounts: [existAccounts[1]],
            authState: {},
        };

        expect(mockFn.saveFn).toBeCalledWith(
            'dummy',
            JSON.stringify(expectAccountList),
            { 'service': 'test-service-name' }
        );
        expect(mockFn.loadActionListFn).toBeCalled();
        expect(fn).toBeCalled();
    });
    test('no exist id', async () => {
        mocked(getGenericPassword).mockImplementation(async () => {
            return {
                service: 'test-service-name',
                username: 'dummy',
                password: JSON.stringify(
                    {
                        accounts: existAccounts,
                        authState: {},
                    },
                ),
            };
        });
        const mockFn = createMockFn();
        mocked(asyncLoadAccountListAfterShow).mockImplementation(mockFn.loadActionListFn);
        mocked(setGenericPassword).mockImplementation(mockFn.saveFn);
        const fn = jest.fn();
        await asyncRemoveAccountAction('account-id0', jest.fn(), fn);
        expect(mockFn.saveFn).toBeCalled();
        const expectAccountList = {
            accounts: [...existAccounts],
            authState: {},
        };

        expect(mockFn.saveFn).toBeCalledWith(
            'dummy',
            JSON.stringify(expectAccountList),
            { 'service': 'test-service-name' }
        );
        expect(mockFn.loadActionListFn).toBeCalled();
        expect(fn).toBeCalled();
    });
    test('no exist data', async () => {
        mocked(getGenericPassword).mockImplementation(async () => {
            return false;
        });
        const mockFn = createMockFn();
        mocked(asyncLoadAccountListAfterShow).mockImplementation(mockFn.loadActionListFn);
        mocked(setGenericPassword).mockImplementation(mockFn.saveFn);
        const fn = jest.fn();
        await asyncRemoveAccountAction('account-id0', jest.fn(), fn);
        expect(mockFn.saveFn).not.toBeCalled();
        expect(mockFn.loadActionListFn).toBeCalled();
        expect(fn).toBeCalled();
    });
    test('throw', async () => {
        mocked(getGenericPassword).mockImplementation(async () => {
            throw new Error();
        });
        const mockFn = createMockFn();
        mocked(asyncLoadAccountListAfterShow).mockImplementation(mockFn.loadActionListFn);
        mocked(setGenericPassword).mockImplementation(mockFn.saveFn);
        const alert = jest.fn();
        mocked(Alert.alert).mockImplementation(alert);
        const fn = jest.fn();
        await asyncRemoveAccountAction('account-id0', jest.fn(), fn);
        expect(mockFn.saveFn).not.toBeCalled();
        expect(alert).toBeCalled();
        expect(mockFn.loadActionListFn).toBeCalled();
        expect(fn).toBeCalled();
    });
});
