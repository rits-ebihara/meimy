import { reducers } from '../../account-manager/Store';

jest.mock('../../account-manager/reducers/AccountListReducer', () => {
    return {};
});
jest.mock('../../account-manager/reducers/AccountReducer', () => {
    return {};
});
jest.mock('../../account-manager/reducers/EimAppListReducer', () => {
    return {};
});
jest.mock('../../account-manager/reducers/WebSignInReducer', () => {
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
