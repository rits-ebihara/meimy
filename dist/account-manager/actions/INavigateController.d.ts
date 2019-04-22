import { NavigationParams, NavigationScreenProp } from 'react-navigation';
import { AnyAction, Dispatch } from 'redux';
import { IAccountListState } from '../states/IAccountLisState';
import { IAuthState } from '../states/IAuthStates';
export default interface INavigateController {
    navigateForLink: (accountListState: IAccountListState, pLinkState: IAuthState, dispatch: Dispatch<AnyAction>, navigation: NavigationScreenProp<any, NavigationParams>, replace?: boolean) => Promise<boolean>;
    clear: () => void;
    getLinkState: () => IAuthState;
    openApp: (pLinkState: IAuthState, navigation: NavigationScreenProp<any, NavigationParams>) => Promise<void>;
    openAccountManager: (navigation: NavigationScreenProp<any, any>, dispatch: Dispatch<AnyAction>, link?: string | undefined, hash?: string | undefined) => void;
}
