import { getGenericPassword } from 'react-native-keychain';
import { Action, Dispatch } from 'redux';
import ShortId from 'shortid';

import { getConfig } from '../Config';
import { createInitAccountListState, IAccountListState } from '../states/IAccountLisState';
import { IAuthState } from '../states/IAuthStates';

const config = getConfig();

export const SHOW_ACCOUNT_LIST = ShortId();

export interface IShowAccountListAction extends Action {
    accountList: IAccountListState;
}

export const asyncLoadAccountListAfterShow = async (dispatch: Dispatch) => {
    let accountList: IAccountListState = createInitAccountListState();
    const json = await getGenericPassword({ service: config.accountListServiceName });
    if (!!json && typeof json !== 'boolean') {
        const _accountList = JSON.parse(json.password) as IAccountListState;
        if (('accounts' in (_accountList as IAccountListState))) {
            accountList = _accountList;
        }
    }
    const action: IShowAccountListAction = {
        accountList,
        type: SHOW_ACCOUNT_LIST,
    };
    dispatch(action);
};

export const SET_AUTH_STATE = ShortId();

export interface ISetAuthState extends Action {
    authState: IAuthState;
}

export const createSetAuthState = (authState: IAuthState): ISetAuthState => {
    return {
        authState,
        type: SET_AUTH_STATE,
    };
};
