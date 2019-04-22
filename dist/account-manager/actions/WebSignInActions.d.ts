import { Action } from 'redux';
import { IAccountState } from '../states/IAccountState';
export declare const SHOW_WEB_PAGE: string;
export interface IShowWebPageAction extends Action {
    account: IAccountState;
}
export declare const createShowWebPageAction: (account: IAccountState) => IShowWebPageAction;
