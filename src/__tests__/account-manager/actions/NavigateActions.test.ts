import { Linking } from 'react-native';
import { mocked } from 'ts-jest/utils';

import { SET_ACCOUNT_ACTION } from '../../../account-manager/actions/AccountActions';
import { SET_AUTH_STATE } from '../../../account-manager/actions/AccountListActions';
import { SET_APP_LIST } from '../../../account-manager/actions/EimAppListActions';
import { NavigateController } from '../../../account-manager/actions/NavigateActions';
import { getEimAccount } from '../../../account-manager/EimAccount';
import routePageNames from '../../../account-manager/RoutePageNames';
import { IAccountListState } from '../../../account-manager/states/IAccountLisState';
import { IAuthState } from '../../../account-manager/states/IAuthStates';
import { EIMServiceAdapter } from '../../../eim-service/EIMServiceAdapter';

jest.mock('react-native', () => {
    return {
        Linking: {
            canOpenURL: jest.fn(),
            openURL: jest.fn(),
        },
    };
});
jest.mock('react-navigation');
jest.mock('native-base');
jest.mock('../../../eim-service/EIMServiceAdapter.ts', () => {
    return {
        EIMServiceAdapter: jest.fn(),
    };
});
jest.mock('../../../account-manager/EimAccount', () => {
    return {
        getEimAccount: jest.fn(),
    };
});
jest.mock('../../../account-manager/Config.ts', () => {
    return {
        getConfig: () => {
            return {
                appKeyPrefix: 'app-prefix',
                startPage: 'start-page',
            };
        }
    };
});

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

test('clear', () => {
    const target = new NavigateController();
    target['linkStates'] = {
        siteDomain: 'domain',
        appKey: 'appkey',
    };
    target.clear();
    expect(target.getLinkState()).toEqual({});
});

describe('openApp', () => {
    test('exist parentMainPage -> goto parentMainPage', async () => {
        const listState: IAuthState = {};
        const navigation = {
            navigate: jest.fn(),
        };
        const eimAccountSave = jest.fn();
        const eimAccountLoadUser = jest.fn();
        mocked(getEimAccount).mockImplementation(() => {
            return {
                save: eimAccountSave,
                loadUser: eimAccountLoadUser,
            } as any;
        });
        const target = new NavigateController();
        target.parentMainPage = 'main_page';
        target.parentNavParams = {};
        await target.openApp(listState, navigation as any);
        expect(eimAccountSave).toBeCalled();
        expect(eimAccountLoadUser).toBeCalled();
        expect(navigation.navigate).toBeCalledWith(
            'main_page', target.parentNavParams,
        );
    });
    test('not exist parentMainPage -> 何もしない', async () => {
        const listState: IAuthState = {};
        const navigation = {
            navigate: jest.fn(),
        };
        const eimAccountSave = jest.fn();
        const eimAccountLoadUser = jest.fn();
        mocked(getEimAccount).mockImplementation(() => {
            return {
                save: eimAccountSave,
                loadUser: eimAccountLoadUser,
            } as any;
        });
        const target = new NavigateController();
        target.parentMainPage = '';
        target.parentNavParams = {};
        await target.openApp(listState, navigation as any);
        expect(eimAccountSave).toBeCalled();
        expect(eimAccountLoadUser).toBeCalled();
        expect(navigation.navigate).not.toBeCalled();
    });
});

describe('openAccountManager', () => {
    let target: NavigateController;
    beforeEach(() => {
        target = new NavigateController;
        target['_openAccountManager'] = jest.fn();

    });
    test('exist link and hash -> open appKey, and domain', async () => {
        const navigation = {
            name: 'navigate',
        };
        const dispatch = jest.fn();
        const link = 'http://app-dev16.ope.azure.ricoh-eim.com/';
        const hash = '/apps/app_key/documents/doc_id';
        await target.openAccountManager(
            navigation as any,
            dispatch,
            link,
            hash);
        expect(target['_openAccountManager']).toBeCalledWith(
            dispatch, navigation,
            link, hash,
            'app_key', 'app-dev16.ope.azure.ricoh-eim.com');
    });
    test('exist miss link and hash -> open appKey, and domain', async () => {
        const navigation = {
            name: 'navigate',
        };
        const dispatch = jest.fn();
        const link = 'http://app-dev16.ope.azure.ricoh-eim.com/';
        const hash = '/apps/app_key/documents';
        await target.openAccountManager(
            navigation as any,
            dispatch,
            link,
            hash);
        expect(target['_openAccountManager']).toBeCalledWith(
            dispatch, navigation,
            link, hash,
            undefined, 'app-dev16.ope.azure.ricoh-eim.com');
    });
    test('no exist (link and hash) and exist account -> load and open', async () => {
        mocked(getEimAccount).mockImplementation(() => {
            return {
                load: async () => {
                    return {
                        appKey: 'app-key',
                        domain: 'domain',
                        eimTokens: [],
                        siteName: 'site-name',
                    }
                }
            } as any;
        });
        const navigation = {
            name: 'navigate',
        };
        const dispatch = jest.fn();
        await target.openAccountManager(
            navigation as any,
            dispatch);
        expect(target['_openAccountManager']).toBeCalledWith(
            dispatch, navigation,
            undefined, undefined,
            'app-key', 'domain');
    });
    test('no exist (link and hash and account) -> load and open', async () => {
        mocked(getEimAccount).mockImplementation(() => {
            return {
                load: async () => {
                    return null;
                },
            } as any;
        });
        const navigation = {
            name: 'navigate',
        };
        const dispatch = jest.fn();
        await target.openAccountManager(
            navigation as any,
            dispatch);
        expect(target['_openAccountManager']).toBeCalledWith(
            dispatch, navigation,
            undefined, undefined,
            undefined, undefined);
    });
});

describe('_openAccountManager', () => {
    let target: NavigateController;
    let dispatch: jest.Mock;
    let navigation: any;

    beforeAll(() => {
    });
    beforeEach(() => {
        target = new NavigateController();
        dispatch = jest.fn();
        navigation = {
            navigate: jest.fn(),
        };
        mocked(Linking.openURL).mockClear();
    });
    test('link, hash, appkey, domain is undefined, exist account manager app', async () => {
        mocked(Linking.canOpenURL).mockImplementation(jest.fn(async () => {
            return true;
        }));
        const expectURL = 'eimapplink-accountmanager://accountmanager/?appprefix=app-prefix&mapp=app-prefix';
        await target['_openAccountManager'](dispatch, navigation);
        expect(Linking.canOpenURL).toBeCalledWith(expectURL);
        expect(Linking.openURL).toBeCalledWith(expectURL);
    });
    test('link, hash is undefined, exist appkey, domain, account manager app', async () => {
        mocked(Linking.canOpenURL).mockImplementation(jest.fn(async () => {
            return true;
        }));
        const expectURL = 'eimapplink-accountmanager://accountmanager/?'
            + 'appprefix=app-prefix&mapp=app-prefix&appkey=app-key&domain=domain';
        await target['_openAccountManager'](
            dispatch, navigation,
            undefined, undefined,
            'app-key', 'domain');
        expect(Linking.canOpenURL).toBeCalledWith(expectURL);
        expect(Linking.openURL).toBeCalledWith(expectURL);
    });
    test('exist link, hash, appkey, domain, account manager app', async () => {
        mocked(Linking.canOpenURL).mockImplementation(jest.fn(async () => {
            return true;
        }));
        const expectURL = 'eimapplink-accountmanager://accountmanager/?'
            + 'appprefix=app-prefix&mapp=app-prefix&appkey=app-key&domain=domain'
            + '&link=https%3A%2F%2Fexsample.com%2F%23%2Fa%2Fb%2Fc%2F';
        await target['_openAccountManager'](
            dispatch, navigation,
            'https://exsample.com/', '/a/b/c/',
            'app-key', 'domain');
        expect(Linking.canOpenURL).toBeCalledWith(expectURL);
        expect(Linking.openURL).toBeCalledWith(expectURL);
    });
    test('link, hash, appkey, domain is undefined, no exist account manager app', async () => {
        mocked(Linking.canOpenURL).mockImplementation(jest.fn(async () => {
            return false;
        }));
        await target['_openAccountManager'](dispatch, navigation);
        const expectURL = 'eimapplink-accountmanager://accountmanager/?appprefix=app-prefix&mapp=app-prefix';
        const expectAuthState = {
            appKeyPrefix: 'app-prefix',
        }
        expect(Linking.canOpenURL).toBeCalledWith(expectURL);
        expect(Linking.openURL).not.toBeCalled();
        expect(target.parentMainPage).toEqual('start-page');
        expect(dispatch).toBeCalledWith({
            authState: expectAuthState,
            type: SET_AUTH_STATE
        });
        expect(navigation.navigate).toBeCalledWith('auth');
    });
    test('link, hash is undefined, exist appkey, domain, no exit account manager app', async () => {
        mocked(Linking.canOpenURL).mockImplementation(jest.fn(async () => {
            return false;
        }));
        await target['_openAccountManager'](
            dispatch, navigation,
            undefined, undefined,
            'app-key', 'domain');
        const expectAuthState = {
            appKeyPrefix: 'app-prefix',
            appKey: 'app-key',
            siteDomain: 'domain',
        }

        const expectURL = 'eimapplink-accountmanager://accountmanager/?'
            + 'appprefix=app-prefix&mapp=app-prefix&appkey=app-key&domain=domain';
        expect(Linking.canOpenURL).toBeCalledWith(expectURL);
        expect(Linking.openURL).not.toBeCalled();
        expect(target.parentMainPage).toEqual('start-page');
        expect(target.parentNavParams).toEqual(undefined)
        expect(dispatch).toBeCalledWith({
            authState: expectAuthState,
            type: SET_AUTH_STATE
        });
        expect(navigation.navigate).toBeCalledWith('auth');
    });
    test('exist link, hash, appkey, domain, no exist account manager app', async () => {
        mocked(Linking.canOpenURL).mockImplementation(jest.fn(async () => {
            return false;
        }));
        await target['_openAccountManager'](
            dispatch, navigation,
            'https://exsample.com/', '/a/b/c/d',
            'app-key', 'domain');
        const expectURL = 'eimapplink-accountmanager://accountmanager/?'
            + 'appprefix=app-prefix&mapp=app-prefix&appkey=app-key&domain=domain'
            + '&link=https%3A%2F%2Fexsample.com%2F%23%2Fa%2Fb%2Fc%2F';
        const expectAuthState = {
            appKeyPrefix: 'app-prefix',
            appKey: 'app-key',
            siteDomain: 'domain',
            link: 'https://exsample.com/#/a/b/c/d',
        }
        expect(Linking.canOpenURL).toBeCalledWith(expectURL);
        expect(Linking.openURL).not.toBeCalled();
        expect(target.parentMainPage).toEqual('start-page');
        expect(target.parentNavParams).toEqual({
            parameter: 'd',
        })
        expect(dispatch).toBeCalledWith({
            authState: expectAuthState,
            type: SET_AUTH_STATE
        });
        expect(navigation.navigate).toBeCalledWith('auth');
    });
    test('exist link,missed hash, appkey, domain, no exist account manager app', async () => {
        mocked(Linking.canOpenURL).mockImplementation(jest.fn(async () => {
            return false;
        }));
        await target['_openAccountManager'](
            dispatch, navigation,
            'https://exsample.com/', '/a/b/c',
            'app-key', 'domain');
        const expectURL = 'eimapplink-accountmanager://accountmanager/?'
            + 'appprefix=app-prefix&mapp=app-prefix&appkey=app-key&domain=domain'
            + '&link=https%3A%2F%2Fexsample.com%2F%23%2Fa%2Fb%2Fc%2F';
        const expectAuthState = {
            appKeyPrefix: 'app-prefix',
            appKey: 'app-key',
            siteDomain: 'domain',
            link: 'https://exsample.com/#/a/b/c',
        }
        expect(Linking.canOpenURL).toBeCalledWith(expectURL);
        expect(Linking.openURL).not.toBeCalled();
        expect(target.parentMainPage).toEqual('start-page');
        expect(target.parentNavParams).toEqual({
            parameter: undefined,
        })
        expect(dispatch).toBeCalledWith({
            authState: expectAuthState,
            type: SET_AUTH_STATE,
        });
        expect(navigation.navigate).toBeCalledWith('auth');
    });
});
