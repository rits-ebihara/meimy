import { Component } from 'react';
import { WebViewUriSource } from 'react-native';
import { ICombinedNavProps, IProps } from '../../../redux-helper/redux-helper';
import { IAccountManagerState } from '../../IAccountManagerState';
import { IAccountListState } from '../../states/IAccountLisState';
import IWebSignInState from '../../states/IWebSignInState';
interface IWebSignInProps extends IWebSignInState {
    accountListState: IAccountListState;
}
export declare type ThisProps = ICombinedNavProps<IWebSignInProps>;
export interface IWebSigninLocalState {
    uriSource: WebViewUriSource;
}
export declare class _WebSignIn extends Component<ThisProps, IWebSigninLocalState> {
    static navigationOptions: () => {
        headerStyle: {
            backgroundColor: string;
        };
        headerTintColor: string;
        headerTitle: string;
    };
    private postedIdPass;
    private webview;
    private saveProp;
    constructor(props: ThisProps);
    render(): JSX.Element | null;
    componentDidMount: () => void;
    private onMessage;
    private setRef;
    private postIdPassEimForm;
    private postIdPassFor365;
    private onLoadStartWebView;
}
export declare const __private__: {
    mapStateToProps: (state: IAccountManagerState) => IProps<IWebSignInProps>;
};
declare const _default: any;
export default _default;
