import { Component } from 'react';
import { ICombinedNavProps } from '../redux-helper/redux-helper';
export interface INavProps {
    parameter: string;
}
export interface ISplashState {
    appName: string;
}
export declare abstract class SplashScreen<T extends ISplashState> extends Component<ICombinedNavProps<T>> {
    render(): JSX.Element;
    componentDidMount: () => void;
    private checkConnectOnResume;
    private linkInitialURL;
    private urlEvent;
    private didComeFromAccountManager;
    private fromAccountManager;
}
