import { IAccountListState } from './states/IAccountLisState';
import { IAccountState } from './states/IAccountState';
import IEimAppList from './states/IEimAppListState';
import IWebSignInState from './states/IWebSignInState';
export interface IAccountManagerState {
    account: IAccountState;
    accountList: IAccountListState;
    appList: IEimAppList;
    webSignIn: IWebSignInState;
}
