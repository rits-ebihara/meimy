import { IAccountState } from './IAccountState';
import { IAuthState } from './IAuthStates';

export interface IAccountListState {
    accounts: IAccountState[];
    authState: IAuthState;
}

export const createInitAccountListState = (): IAccountListState => {
    return {
        accounts: [],
        authState: {},
    };
};
