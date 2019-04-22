import { Action, Dispatch } from 'redux';
import { IEimApp } from '../states/IEimAppListState';
import INavigateController from './INavigateController';
export declare const SET_APP_LIST: string;
export interface ISetAppListAction extends Action {
    appList: IEimApp[];
}
export declare const createSetAppListAction: (appList: IEimApp[]) => ISetAppListAction;
export declare const LOAD_APP_LIST: string;
export interface ILoadAppListAction extends Action {
}
export declare const createLoadAppListAction: (dispatch: Dispatch<import("redux").AnyAction>, navigateActions: INavigateController) => ILoadAppListAction | null;
