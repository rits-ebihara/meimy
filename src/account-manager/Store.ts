import accountListReducer from './reducers/AccountListReducer';
import accountReducer from './reducers/AccountReducer';
import appListReducer from './reducers/EimAppListReducer';
import webSignInReducer from './reducers/WebSignInReducer';

export const reducers = {
    account: accountReducer,
    accountList: accountListReducer,
    appList: appListReducer,
    webSignIn: webSignInReducer,
};
