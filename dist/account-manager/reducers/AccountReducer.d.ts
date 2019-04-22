import { AnyAction, Reducer } from 'redux';
import { IAccountState } from '../states/IAccountState';
declare const accountReducer: Reducer<IAccountState, AnyAction>;
export default accountReducer;
