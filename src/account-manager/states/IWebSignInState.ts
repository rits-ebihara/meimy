import { IAccountState } from './IAccountState';

export default interface IWebSignInState {
    account?: IAccountState;
}
export const createInitWebSignInState = (): IWebSignInState => {
    return {
        account: undefined,
    };
};
