import { AnyAction, Reducer } from 'redux';
import { IAccountListState } from '../states/IAccountLisState';
declare const accountListReducer: Reducer<IAccountListState, AnyAction>;
export default accountListReducer;
