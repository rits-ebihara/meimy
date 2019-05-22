import { NavigationScreenProp } from 'react-navigation';
import { Dispatch } from 'redux';
import { IAccountListState } from '../states/IAccountLisState';
import { IAuthState } from '../states/IAuthStates';
import INavigateController from './INavigateController';
export declare class NavigateController implements INavigateController {
    parentMainPage?: string;
    parentNavParams?: {
        [key: string]: any;
    };
    private linkStates;
    private transferAccountPage;
    private determinedAppAndDomain;
    private deteminedAppOnly;
    navigateForLink: (accountListState: IAccountListState, pLinkState: IAuthState, dispatch: Dispatch<import("redux").AnyAction>, navigation: NavigationScreenProp<any, import("react-navigation").NavigationParams>, replace?: boolean) => Promise<boolean>;
    clear: () => void;
    getLinkState: () => IAuthState;
    openApp: (pLinkState: IAuthState, navigation: NavigationScreenProp<any, import("react-navigation").NavigationParams>) => Promise<void>;
    openAccountManager: (navigation: NavigationScreenProp<any, import("react-navigation").NavigationParams>, dispatch: Dispatch<import("redux").AnyAction>, link?: string | undefined, hash?: string | undefined) => Promise<void>;
    private _openAccountManager;
}
declare const _default: NavigateController;
export default _default;
