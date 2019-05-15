import { mocked } from 'ts-jest/utils';

import {
    createLoadAppListAction,
    createSetAppListAction,
    LOAD_APP_LIST,
    SET_APP_LIST,
} from '../../../src/account-manager/actions/EimAppListActions';
import INavigateController from '../../../src/account-manager/actions/INavigateController';
import { IAuthState } from '../../../src/account-manager/states/IAuthStates';
import { IEimApp } from '../../../src/account-manager/states/IEimAppListState';
import { EIMServiceAdapter } from '../../../src/eim-service';

jest.mock('../../../src/eim-service/index', () => {
    return {
        ...jest.requireActual('../../../src/eim-service/index'),
        EIMServiceAdapter: jest.fn(),
    };
});
jest.mock('native-base', () => {
    return {
        ...jest.requireActual('native-base'),
        Toast: {
            show: jest.fn(),
        },
    };
});
const getExpectEimApps = (): IEimApp[] => ([
    {
        appKey: 'app-key-1',
        appName: 'app-name',
        description: 'description',
        siteDomain: 'site-domain',
        siteName: 'site-name',
        tokens: ['t001-1'],
    },
    {
        appKey: 'app-key-2',
        appName: 'app-name2',
        description: 'description2',
        siteDomain: 'site-domain',
        siteName: 'site-name',
        tokens: ['t001-1'],
    },
]);
test('createSetAppListAction', () => {
    const expectEimApps = getExpectEimApps();
    const action = createSetAppListAction(expectEimApps);
    expect(action).toEqual({
        appList: expectEimApps,
        type: SET_APP_LIST,
    });
});

describe('createLoadAppListAction', () => {
    const getLinkState = (): IAuthState => ({
        appKey: '',
        appKeyPrefix: 'app-key',
        mobileAppKey: 'mobileAppKey',
        siteDomain: 'site-domain',
        siteName: 'site-name',
        tokens: ['t001-1'],
        link: 'link',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getNavController = (linkState: any): INavigateController => ({
        clear: jest.fn(),
        getLinkState: () => {
            return linkState;
        },
        navigateForLink: jest.fn(),
        openAccountManager: jest.fn(),
        openApp: jest.fn(),
    });
    const getAppListResponse = {
        body: JSON.stringify({
            apps: [
                {
                    properties: {
                        id: 'app-key-1',
                        name: 'app-name',
                        description: 'description',
                    }
                },
                {
                    properties: {
                        id: 'app-key-2',
                        name: 'app-name2',
                        description: 'description2',
                    }
                }]
        }),
        contentType: '',
        headers: {},
        statusCode: 200,
        tokens: [],
    };
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        mocked(EIMServiceAdapter).mockClear();
    });
    test('success', async () => {
        const dispatch = jest.fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mocked(EIMServiceAdapter).mockImplementation((): EIMServiceAdapter => {
            return {
                getAppList: async () => {
                    return getAppListResponse;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any;
        });
        const onError = jest.fn();
        await createLoadAppListAction(dispatch, getNavController(getLinkState()), onError);
        expect(dispatch).toBeCalledTimes(2);
        const expectEimApps = getExpectEimApps();
        expect(dispatch).toHaveBeenLastCalledWith({
            appList: expectEimApps, type: SET_APP_LIST
        });
        expect(onError).not.toBeCalled();
    });
    test('success: no name', async () => {
        const dispatch = jest.fn();
        const onError = jest.fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mocked(EIMServiceAdapter).mockImplementation((): EIMServiceAdapter => {
            return {
                getAppList: async () => {
                    return getAppListResponse;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any;
        });
        const linkState = getLinkState();
        linkState.siteName = '';
        await createLoadAppListAction(dispatch, getNavController(linkState), onError);
        expect(dispatch).toBeCalledTimes(2);
        const expectEimApps = getExpectEimApps();
        expectEimApps[0].siteName = expectEimApps[0].siteDomain;
        expectEimApps[1].siteName = expectEimApps[1].siteDomain;
        expect(dispatch).toHaveBeenLastCalledWith({
            appList: expectEimApps, type: SET_APP_LIST
        });
        expect(onError).not.toBeCalled();
    });
    test('faild', async () => {
        const dispatch = jest.fn();
        const onError = jest.fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mocked(EIMServiceAdapter).mockImplementation((): EIMServiceAdapter => {
            return {
                getAppList: async () => {
                    throw new Error();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any;
        });
        await createLoadAppListAction(dispatch, getNavController(getLinkState()), onError);
        expect(dispatch).toBeCalledWith({ type: LOAD_APP_LIST });
        expect(onError).toBeCalled();
    });
    test('no siteDomain', async () => {
        const dispatch = jest.fn();
        const onError = jest.fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mocked(EIMServiceAdapter).mockImplementation((): EIMServiceAdapter => {
            return {
                getAppList: async () => {
                    return getAppListResponse;
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any;
        });
        const linkState = getLinkState();
        linkState.siteDomain = '';
        await createLoadAppListAction(dispatch, getNavController(linkState), onError);
        expect(dispatch).toBeCalledTimes(0);
        expect(onError).not.toBeCalled();
    });
    test('no token', async () => {
        const dispatch = jest.fn();
        const onError = jest.fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mocked(EIMServiceAdapter).mockImplementation((): EIMServiceAdapter => {
            return {
                getAppList: async () => {
                    return getAppListResponse;
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any;
        });
        const linkState = getLinkState();
        linkState.tokens = undefined;
        await createLoadAppListAction(dispatch, getNavController(linkState), onError);
        expect(dispatch).toBeCalledTimes(0);
        expect(onError).not.toBeCalled();
    });
});
