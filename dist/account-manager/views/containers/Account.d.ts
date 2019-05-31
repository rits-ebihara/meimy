import { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ICombinedNavProps, IProps } from '../../../redux-helper/redux-helper';
import { IAccountManagerState } from '../../IAccountManagerState';
import { IAccountListState } from '../../states/IAccountLisState';
import { IAccountState } from '../../states/IAccountState';
interface IDiffState {
    loginResultMessage: string;
    siteNameError: boolean;
    siteDomainError: boolean;
    mode: 'view' | 'edit';
    shownEditMenu: boolean;
    shownLoginDialog: boolean;
}
export interface IAccountProps extends IAccountState {
    accountListState: IAccountListState;
}
export interface ILocaleState extends IAccountState, IDiffState {
}
export declare class _Account extends Component<ICombinedNavProps<IAccountProps>, ILocaleState> {
    static navigationOptions: ({ navigation }: NavigationScreenProps<import("react-navigation").NavigationParams, any>) => {
        headerRight: JSX.Element;
        headerStyle: {
            backgroundColor: string;
        };
        headerTintColor: string;
        headerTitle: string;
    };
    private backupState;
    constructor(props: ICombinedNavProps<IAccountProps>);
    render: () => JSX.Element;
    componentDidMount: () => void;
    componentDidUpdate: (_preProp: ICombinedNavProps<IAccountState>, preState: ILocaleState) => void;
    private createSignInButton;
    private onPressEdit;
    private onPressCancelEdit;
    private onPressRemove;
    private navPop;
    private onPressConnect;
    private changeInputState;
    private onChangeState;
    private onPressSave;
    private inputCheck;
    private backPage;
    private createErrorMessages;
    private successConnect;
    private createState;
}
export declare const __private__: {
    mapStateToProps: (state: IAccountManagerState) => IProps<IAccountProps>;
};
declare const _default: any;
export default _default;
