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

describe('on load', () => {
    test('createStackNavigator', async () => {
        const fn = jest.fn(() => {
            return {};
        });
        (createStackNavigator as any).mockImplementation(fn);
        const RoutePageNames = await import('../../src/account-manager/RouteMap');

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
