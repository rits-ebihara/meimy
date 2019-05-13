import { Toast } from 'native-base';
import { mocked } from 'ts-jest/utils';

import {
    createLoadAppListAction,
    createSetAppListAction,
    SET_APP_LIST,
} from '../../../src/account-manager/actions/EimAppListActions';
import INavigateController from '../../../src/account-manager/actions/INavigateController';
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
const expectEimApps: IEimApp[] = [
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
];
test('createSetAppListAction', () => {
    const action = createSetAppListAction(expectEimApps);
    expect(action).toEqual({
        appList: expectEimApps,
        type: SET_APP_LIST,
    });
});

describe('createLoadAppListAction', () => {
    const navController: INavigateController = {
        clear: jest.fn(),
        getLinkState: () => {
            return {
                appKey: '',
                appKeyPrefix: 'app-key',
                mobileAppKey: 'mobileAppKey',
                siteDomain: 'site-domain',
                siteName: 'site-name',
                tokens: ['t001-1'],
                link: 'link',
            }
        },
        navigateForLink: jest.fn(),
        openAccountManager: jest.fn(),
        openApp: jest.fn(),
    };
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        mocked(EIMServiceAdapter).mockClear();
    });
    test('success', async () => {
        const dispatch = jest.fn();
        const toastShow = jest.fn();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mocked(EIMServiceAdapter).mockImplementation((): EIMServiceAdapter => {
            return {
                getAppList: async () => {
                    return {
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
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any;
        });
        mocked(Toast.show).mockImplementation(() => {
            return {
                show: toastShow,
            };
        });
        await createLoadAppListAction(dispatch, navController);
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch).toHaveBeenLastCalledWith({
            appList: expectEimApps, type: SET_APP_LIST
        });
        expect(toastShow).not.toBeCalled();
    });
});
