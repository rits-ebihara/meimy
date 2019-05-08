import { createStackNavigator } from 'react-navigation';

jest.mock('../../src/account-manager/views/containers/AccountList', () => {
    return {};
});
jest.mock('../../src/account-manager/views/containers/Account', () => {
    return {};
});
jest.mock('../../src/account-manager/views/containers/EimAppList.tsx', () => {
    return {};
});
jest.mock('../../src/account-manager/views/containers/WebSignIn.tsx', () => {
    return {};
});

jest.mock('react-navigation', () => {
    return {
        createStackNavigator: jest.fn(() => {
            return {};
        }),
    };
});
jest.mock('react-navigation-redux-helpers', () => {
    return {
        createNavigationReducer: jest.fn(),
        createReactNavigationReduxMiddleware: jest.fn(),
        ReducerState: {},
    }
});

jest.mock('react-native-keychain', () => {
    return {
        setGenericPassword: jest.fn(),
        getGenericPassword: jest.fn(async () => { return false }),
    }
});

jest.mock('react-native-cookies', () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(),
    get: () => Promise.resolve(null),
}));
describe('on load', () => {
    test('createStackNavigator', async () => {
        const fn = jest.fn(() => {
            return {};
        });
        (createStackNavigator as any).mockImplementation(fn);
        const RoutePageNames = await import('../../src/account-manager/RoutePageNames');

        const target = RoutePageNames.authStackNav;
        expect(target).toBeTruthy();
        expect(fn).toBeCalled();
        const expectArg1 = { "accountList": {}, "accountPage": {}, "appListPage": {}, "webSignInPage": {} };
        const expectArg2 = {
            initialRouteName: 'accountList',
        };
        expect(fn).toHaveBeenCalledWith(expectArg1, expectArg2);
    });
});
