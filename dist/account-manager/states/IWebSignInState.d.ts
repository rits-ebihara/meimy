import { IAccountState } from './IAccountState';
export default interface IWebSignInState {
    account?: IAccountState;
}
export declare const createInitWebSignInState: () => IWebSignInState;
