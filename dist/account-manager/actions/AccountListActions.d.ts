import { Action, Dispatch } from 'redux';
import { IAccountListState } from '../states/IAccountLisState';
import { IAuthState } from '../states/IAuthStates';
export declare const SHOW_ACCOUNT_LIST: string;
export interface IShowAccountListAction extends Action {
    accountList: IAccountListState;
}
export declare const asyncLoadAccountListAfterShow: (dispatch: Dispatch<import("redux").AnyAction>) => Promise<void>;
export declare const SET_AUTH_STATE: string;
export interface ISetAuthState extends Action {
    authState: IAuthState;
}
export declare const createSetAuthState: (authState: IAuthState) => ISetAuthState;
