import { IShowWebPageAction, SHOW_WEB_PAGE } from '../../../account-manager/actions/WebSignInActions';
import webSignInReducer from '../../../account-manager/reducers/WebSignInReducer';
import { IAccountState } from '../../../account-manager/states/IAccountState';

describe('', () => {
    const initState = {
        account: undefined,
    };
    test('init', () => {
        const state = webSignInReducer(undefined, { type: null });
        expect(state).toEqual(initState);
    });
    test('SHOW_WEB_PAGE', () => {
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
        const action: IShowWebPageAction = {
            account,
            type: SHOW_WEB_PAGE
        };
        const state = webSignInReducer(initState, action);
        expect(state).toEqual({ account })
    });
});
