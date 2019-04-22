import { Component } from 'react';
import { ImageURISource } from 'react-native';
import { DrawerItemsProps } from 'react-navigation';
interface IProps extends DrawerItemsProps {
    borderColor: string;
    buttonColor: string;
    appDisplayName: string;
    appVersion: string;
    splashPageName: string;
}
interface ILocalState {
    avatarFaceUrl?: ImageURISource;
}
export declare class DrawerContent extends Component<IProps, ILocalState> {
    private $isMounted;
    constructor(props: IProps);
    render(): JSX.Element | null;
    componentDidMount: () => void;
    componentWillUnmount: () => void;
    onPressChangeSite: () => Promise<void>;
}
export {};
