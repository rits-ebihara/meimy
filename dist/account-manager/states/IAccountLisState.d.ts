import { IAccountState } from './IAccountState';
import { IAuthState } from './IAuthStates';
export interface IAccountListState {
    accounts: IAccountState[];
    authState: IAuthState;
}
export declare const createInitAccountListState: () => IAccountListState;
