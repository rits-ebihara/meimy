import { Action, Dispatch } from 'redux';
import { IAccountState } from '../states/IAccountState';
export declare const SET_ACCOUNT_ACTION: string;
export interface ISetAccountAction extends Action {
    account: IAccountState;
}
export declare const createSetAccountAction: (account: IAccountState) => ISetAccountAction;
export declare const asyncSaveAccountAction: (account: IAccountState, dispatch: Dispatch<import("redux").AnyAction>) => Promise<void>;
export declare const REMOVE_ACCOUNT_ACTION: string;
export interface IRemoveAccountAction extends Action {
}
export declare const asyncRemoveAccountAction: (targetId: string, dispatch: Dispatch<import("redux").AnyAction>, onSuccess: () => void) => Promise<void>;
