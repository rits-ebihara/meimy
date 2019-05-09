import { reducers } from '../../src/account-manager/Store';

jest.mock('../../src/account-manager/reducers/AccountListReducer', () => {
    return {};
});
jest.mock('../../src/account-manager/reducers/AccountReducer', () => {
    return {};
});
jest.mock('../../src/account-manager/reducers/EimAppListReducer', () => {
    return {};
});
jest.mock('../../src/account-manager/reducers/WebSignInReducer', () => {
    return {};
});

test('reducer map', () => {
    expect(reducers).toEqual({
        account: {},
        accountList: {},
        appList: {},
        webSignIn: {},
    });
});
