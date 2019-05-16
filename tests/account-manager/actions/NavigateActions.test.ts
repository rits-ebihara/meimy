import { mocked } from 'ts-jest/utils';

import { SET_ACCOUNT_ACTION } from '../../../src/account-manager/actions/AccountActions';
import { SET_APP_LIST } from '../../../src/account-manager/actions/EimAppListActions';
import { NavigateController } from '../../../src/account-manager/actions/NavigateActions';
import routePageNames from '../../../src/account-manager/RoutePageNames';
import { IAccountListState } from '../../../src/account-manager/states/IAccountLisState';
import { IAuthState } from '../../../src/account-manager/states/IAuthStates';
import { EIMServiceAdapter } from '../../../src/eim-service/EIMServiceAdapter';

jest.mock('react-native', () => {
    return {
        Linking: {
            canOpenUrl: jest.fn(),
        },
    };
});
jest.mock('react-navigation');
jest.mock('native-base');
jest.mock('../../../src/eim-service/EIMServiceAdapter.ts', () => {
    return {
        EIMServiceAdapter: jest.fn(),
    };
});
jest.mock('../../../src/account-manager/EimAccount', () => {
    return {
        getEimAccount: () => {
            return {
                save: jest.fn(),
                loadUser: jest.fn(),
            }
        }
    };
})

describe('navigateForLink', () => {


    describe('has domain and appkey', () => {
        let target: NavigateController;
        let navigation: any;
        const accountLinkState: IAccountListState = {
            accounts: [
                {
                    authType: 'password',
                    eimToken: ['t001'],
                    id: 'id001',
                    lastConnect: null,
                    password: 'pass',
                    siteDomain: 'site-domain1',
                    siteName: 'site1',
                    userId: 'user-id',
                },
                {
                    authType: 'password',
                    eimToken: ['t002'],
                    id: 'id002',
                    lastConnect: null,
                    password: 'pass',
                    siteDomain: 'site-domain2',
                    siteName: 'site2',
                    userId: 'user-id',
                },
            ],
            authState: {},
        };
        let dispatch: jest.Mock;

        beforeEach(() => {
            target = new NavigateController();
            target.parentMainPage = 'mainPage';
            target.parentNavParams = { p1: 'params' };
            target['linkStates'] = {
                siteDomain: 'domain',
                appKey: 'appkey',
            };
            target.openApp = jest.fn();
            navigation = {
                navigate: jest.fn(),
                replace: jest.fn(),
            };
            dispatch = jest.fn();
        });

        test('failed connect, no replace -> move to account page', async () => {
            mocked(EIMServiceAdapter).mockImplementation(() => {
                return {
                    validateToken: async () => { return false },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            });
            const pLinkState: IAuthState = {
                siteDomain: 'site-domain1',
            };
            const result = await target.navigateForLink(
                accountLinkState, pLinkState, dispatch, navigation as any);

            expect(result).toBeTruthy();
            expect(target.openApp).not.toBeCalled();
            expect(dispatch).toBeCalledWith(
                {
                    account: accountLinkState.accounts[0],
                    type: SET_ACCOUNT_ACTION,
                });
            expect(navigation.navigate).toBeCalledWith(routePageNames.accountPageName);
        });
        test('failed connect, replace, exist account -> set and move to account page', async () => {
            mocked(EIMServiceAdapter).mockImplementation(() => {
                return {
                    validateToken: async () => { return false },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            });
            const pLinkState: IAuthState = {
                siteDomain: 'site-domain1',
            };
            const result = await target.navigateForLink(
                accountLinkState, pLinkState, dispatch, navigation as any, true);
            expect(result).toBeTruthy();
            expect(target.openApp).not.toBeCalled();
            expect(dispatch).toBeCalledWith(
                {
                    account: accountLinkState.accounts[0],
                    type: SET_ACCOUNT_ACTION,
                });
            expect(navigation.replace).toBeCalledWith(routePageNames.accountPageName);
        });
        test('failed connect, no replace, no account -> move to new account page', async () => {
            mocked(EIMServiceAdapter).mockImplementation(() => {
                return {
                    validateToken: async () => { return false },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            });
            const pLinkState: IAuthState = {
                siteDomain: 'site-domain0',
            };

            const result = await target.navigateForLink(
                accountLinkState, pLinkState, dispatch, navigation as any);
            expect(result).toBeTruthy();
            expect(target.openApp).not.toBeCalledWith({
                account: {
                    authType: 'o365',
                    eimToken: [],
                    id: null,
                    lastConnect: null,
                    siteDomain: 'site-domain0',
                    siteName: 'site-domain0',
                },
                type: SET_ACCOUNT_ACTION
            });
            expect(navigation.navigate).toBeCalledWith(routePageNames.accountPageName);
        });
        test('success connect -> open app', async () => {
            mocked(EIMServiceAdapter).mockImplementation(() => {
                return {
                    validateToken: async () => { return true },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            });
            const result = await target.navigateForLink(
                accountLinkState, {}, dispatch, navigation as any);
            expect(result).toBeTruthy();
            expect(target.openApp).toBeCalled();
            expect(navigation.navigate).not.toBeCalled();
        });
    });

    describe('has domain', () => {
        let target: NavigateController;
        let navigation: any;
        const accountLinkState: IAccountListState = {
            accounts: [
                {
                    authType: 'password',
                    eimToken: ['t001'],
                    id: 'id001',
                    lastConnect: null,
                    password: 'pass',
                    siteDomain: 'site-domain1',
                    siteName: 'site1',
                    userId: 'user-id',
                },
                {
                    authType: 'password',
                    eimToken: ['t002'],
                    id: 'id002',
                    lastConnect: null,
                    password: 'pass',
                    siteDomain: 'site-domain2',
                    siteName: 'site2',
                    userId: 'user-id',
                },
            ],
            authState: {},
        };
        // const linkState: IAuthState = {};
        let dispatch: jest.Mock;

        beforeEach(() => {
            target = new NavigateController();
            target.parentMainPage = 'mainPage';
            target.parentNavParams = { p1: 'params' };
            target['linkStates'] = {
                siteDomain: 'domain',
            };
            target.openApp = jest.fn();
            navigation = {
                navigate: jest.fn(),
                replace: jest.fn(),
            };
            dispatch = jest.fn();
        });
        test('success connect, exist appkey-prefix, no replace -> move to app list page', async () => {
            mocked(EIMServiceAdapter).mockImplementation(() => {
                return {
                    validateToken: async () => { return true },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            });
            const pLinkState: IAuthState = {
                siteDomain: 'site-domain1',
                appKeyPrefix: 'app-prefix',
            };
            const result = await target.navigateForLink(
                accountLinkState,
                pLinkState,
                dispatch,
                navigation);
            expect(result).toBeTruthy();
            expect(dispatch).toBeCalledWith({
                appList: [],
                type: SET_APP_LIST,
            });
            expect(navigation.navigate).toBeCalledWith(routePageNames.appListPageName);
        });
        test('success connect, no appkey-prefix, no replace -> move to account list page', async () => {
            mocked(EIMServiceAdapter).mockImplementation(() => {
                return {
                    validateToken: async () => { return true },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            });
            const pLinkState: IAuthState = {
                siteDomain: 'site-domain1',
            };
            const result = await target.navigateForLink(
                accountLinkState,
                pLinkState,
                dispatch,
                navigation);
            expect(result).toBeTruthy();
            expect(dispatch).not.toBeCalled();
            expect(navigation.navigate).toBeCalledWith(routePageNames.accountListPageName);
        });
        test('success connect, no appkey-prefix, replace -> move to account list page', async () => {
            mocked(EIMServiceAdapter).mockImplementation(() => {
                return {
                    validateToken: async () => { return true },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            });
            const pLinkState: IAuthState = {
                siteDomain: 'site-domain1',
            };
            const result = await target.navigateForLink(
                accountLinkState,
                pLinkState,
                dispatch,
                navigation,
                true);
            expect(result).toBeTruthy();
            expect(dispatch).not.toBeCalled();
            expect(navigation.replace).toBeCalledWith(routePageNames.accountListPageName);
        });
        test('faild connect -> move to account page', async () => {
            mocked(EIMServiceAdapter).mockImplementation(() => {
                return {
                    validateToken: async () => { return false },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            });
            const pLinkState: IAuthState = {
                siteDomain: 'site-domain1',
            };
            const result = await target.navigateForLink(
                accountLinkState,
                pLinkState,
                dispatch,
                navigation,
                true);
            expect(result).toBeTruthy();
            expect(dispatch).toBeCalledWith({
                account: accountLinkState.accounts[0],
                type: SET_ACCOUNT_ACTION,
            });
            expect(navigation.replace).toBeCalledWith(routePageNames.accountPageName);
        });
    });

    test('not has domain', async () => {
        const target = new NavigateController();
        const navigation = {
            navigate: jest.fn(),
            replace: jest.fn(),
        };
        const accountLinkState: IAccountListState = {
            accounts: [
                {
                    authType: 'password',
                    eimToken: ['t001'],
                    id: 'id001',
                    lastConnect: null,
                    password: 'pass',
                    siteDomain: 'site-domain1',
                    siteName: 'site1',
                    userId: 'user-id',
                },
                {
                    authType: 'password',
                    eimToken: ['t002'],
                    id: 'id002',
                    lastConnect: null,
                    password: 'pass',
                    siteDomain: 'site-domain2',
                    siteName: 'site2',
                    userId: 'user-id',
                },
            ],
            authState: {},
        };
        const dispatch = jest.fn();
        const pLinkState: IAuthState = {
        };
        const result = await target.navigateForLink(
            accountLinkState,
            pLinkState,
            dispatch,
            navigation as any,
            true);
        expect(result).toBeFalsy();
        expect(dispatch).not.toBeCalled();
        expect(navigation.replace).not.toBeCalled();
        expect(navigation.navigate).not.toBeCalled();
    });
});
