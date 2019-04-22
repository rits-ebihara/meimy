import { ReducersMapObject } from 'redux';

import { IAccountManagerState } from './IAccountManagerState';
import accountListReducer from './reducers/AccountListReducer';
import accountReducer from './reducers/AccountReducer';
import appListReducer from './reducers/EimAppListReducer';
import webSignInReducer from './reducers/WebSignInReducer';

export const reducers: ReducersMapObject<IAccountManagerState> = {
    account: accountReducer,
    accountList: accountListReducer,
    appList: appListReducer,
    webSignIn: webSignInReducer,
};
