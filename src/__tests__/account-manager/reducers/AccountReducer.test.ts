import { ISetAccountAction, SET_ACCOUNT_ACTION } from '../../../account-manager/actions/AccountActions';
import accountReducer from '../../../account-manager/reducers/AccountReducer';
import { createInitAccountState, IAccountState } from '../../../account-manager/states/IAccountState';

const initState = {
    authType: 'o365',
    eimToken: [],
    id: null,
    lastConnect: null,
    siteDomain: '',
    siteName: '',
};
describe('', () => {
    test('init', () => {
        const state = accountReducer(undefined, { type: '' });
        expect(state).toEqual(initState);
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
