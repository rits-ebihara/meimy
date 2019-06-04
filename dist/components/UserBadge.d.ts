import React from 'react';
import { ViewStyle } from 'react-native';
export declare type DirectoryTypeKey = 'user' | 'group' | 'organization';
interface IState {
    userId: string;
    userName?: string;
    userFaceUrl?: string;
    userOrg?: string;
    userEMail?: string;
    shownDetailDialog: boolean;
    type: DirectoryTypeKey;
}
export interface IUserBadgeOptionalProps {
    badgeColor: string;
    textColor: string;
    style?: ViewStyle;
    type: DirectoryTypeKey;
    onLongPress: (userId: string) => void;
}
export interface IUserBadgeProps extends Partial<IUserBadgeOptionalProps> {
    userId: string;
}
export declare class UserBadge extends React.Component<IUserBadgeProps, IState> {
    static defaultProps: IUserBadgeOptionalProps;
    private $isMounted;
    constructor(props: IUserBadgeProps);
    render(): JSX.Element;
    componentDidMount: () => void;
    componentWillUnmount: () => void;
    private onPressUserBadge;
    private onLongPressUserBadge;
    private userInfoPanel;
    private serUserInfo;
}
export {};
