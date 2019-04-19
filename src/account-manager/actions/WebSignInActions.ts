import { Action } from 'redux';
import UUID from 'shortid';
import { IAccountState } from '../states/IAccountState';

export const SHOW_WEB_PAGE = UUID();

export interface IShowWebPageAction extends Action {
    account: IAccountState;
}

export const createShowWebPageAction = (account: IAccountState): IShowWebPageAction => {
    return {
        account,
        type: SHOW_WEB_PAGE,
    };
};
