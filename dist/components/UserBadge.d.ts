import React from 'react';
import { ViewStyle } from 'react-native';
interface IState {
    userId: string;
    userName?: string;
    userFaceUrl?: string;
    userOrg?: string;
    userEMail?: string;
    shownDetailDialog: boolean;
    type: 'user' | 'group';
}
export interface IUserBadgeProps {
    userId: string;
    color?: string;
    badgeColor?: string;
    textColor?: string;
    style?: ViewStyle;
    type?: 'user' | 'group';
    onLongPress?: (userId: IState) => void;
}
declare type DefaultProps = {
    [P in keyof IUserBadgeProps]?: IUserBadgeProps[P];
};
export declare class UserBadge extends React.Component<IUserBadgeProps, IState> {
    static defaultProps: DefaultProps;
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
