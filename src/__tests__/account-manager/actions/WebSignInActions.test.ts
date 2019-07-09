import { createShowWebPageAction, SHOW_WEB_PAGE } from '../../../account-manager/actions/WebSignInActions';
import { IAccountState } from '../../../account-manager/states/IAccountState';

test('SHOW_WEB_PAGE', () => {
    const accountState: IAccountState = {
        authType: 'password',
        eimToken: [''],
        id: '001',
        lastConnect: null,
        siteDomain: 'domain',
        siteName: 'name',
    };
    const action = createShowWebPageAction(accountState);
    expect(action).toEqual({
        account: accountState,
        type: SHOW_WEB_PAGE,
    });
});
