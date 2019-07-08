import { Component } from 'react';
import { ImageURISource } from 'react-native';
import { DrawerItemsProps } from 'react-navigation';
export interface IDrawerViewProps extends DrawerItemsProps {
    borderColor: string;
    buttonColor: string;
    appDisplayName: string;
    appVersion: string;
    splashPageName: string;
}
export interface IDrawerViewLocalState {
    avatarFaceUrl?: ImageURISource;
}
export declare class DrawerContent extends Component<IDrawerViewProps, IDrawerViewLocalState> {
    private $isMounted;
    constructor(props: IDrawerViewProps);
    render(): JSX.Element | null;
    componentDidMount: () => Promise<void>;
    componentWillUnmount: () => void;
    onPressChangeSite: () => Promise<void>;
}
