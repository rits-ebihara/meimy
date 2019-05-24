import { ISetAccountAction, SET_ACCOUNT_ACTION } from '../../../src/account-manager/actions/AccountActions';
import accountReducer from '../../../src/account-manager/reducers/AccountReducer';
import { createInitAccountState, IAccountState } from '../../../src/account-manager/states/IAccountState';

describe('', () => {
    test('init', () => {
        const state = accountReducer(undefined, { type: '' });
        expect(state).toEqual(createInitAccountState());
    });
    test('SET_ACCOUNT_ACTION', () => {
        const account: IAccountState = {
            authType: 'password',
            eimToken: ['token'],
            id: 'a001',
            lastConnect: new Date(0),
            password: 'password',
            siteDomain: 'domain',
            siteName: 'site-name',
            userId: 'user-id',
        };
        const action: ISetAccountAction = {
            account,
            type: SET_ACCOUNT_ACTION,
        }
        const state = accountReducer(createInitAccountState(), action);
        expect(state).toEqual(account);
    })
});
