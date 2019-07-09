import {
    ISetAuthState,
    IShowAccountListAction,
    SET_AUTH_STATE,
    SHOW_ACCOUNT_LIST,
} from '../../../account-manager/actions/AccountListActions';
import accountListReducer from '../../../account-manager/reducers/AccountListReducer';
import { IAccountState } from '../../../account-manager/states/IAccountState';
import { IAuthState } from '../../../account-manager/states/IAuthStates';

const initState = {
    accounts: [],
    authState: {},
};
describe('', () => {

    test('init', () => {
        const state = accountListReducer(undefined, { type: '' });
        expect(state).toEqual({
            accounts: [],
            authState: {},
        });
    });
    test('SHOW_ACCOUNT_LIST', () => {
        const expectAccounts: IAccountState[] = [{
            authType: 'password',
            eimToken: ['token'],
            id: 'a001',
            lastConnect: new Date(0),
            password: 'password',
            siteDomain: 'domain',
            siteName: 'site-name',
            userId: 'user-id',
        }];
        const action: IShowAccountListAction = {
            accountList: {
                accounts: expectAccounts,
                authState: { appKey: 'appkey' },
            },
            type: SHOW_ACCOUNT_LIST,
        };
        const state = accountListReducer(initState, action);
        expect(state).toEqual({
            accounts: expectAccounts,
            authState: {},
        });
    });
    test('SET_AUTH_STATE', () => {
        const authState: IAuthState = {
            appKey: 'app-key',
            appKeyPrefix: 'app-key-prefix',
            link: 'link',
            mobileAppKey: 'mobile-app-key',
            siteDomain: 'site-domain',
            siteName: 'site-name',
            tokens: ['token'],
        };
        const action: ISetAuthState = {
            authState,
            type: SET_AUTH_STATE,
        };
        const state = accountListReducer(initState, action);
        expect(state).toEqual({
            accounts: [],
            authState,
        });
    });
});
