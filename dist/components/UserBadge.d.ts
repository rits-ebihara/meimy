import React from 'react';
import { ViewStyle } from 'react-native';
interface IProps {
    userId: string;
    color?: string;
    badgeColor?: string;
    textColor?: string;
    style?: ViewStyle;
    type?: 'user' | 'group';
}
declare type DefaultProps = {
    [P in keyof IProps]?: IProps[P];
};
interface IState {
    userName?: string;
    userFaceUrl?: string;
    userOrg?: string;
    userEMail?: string;
    shownDetailDialog: boolean;
    type: 'user' | 'group';
}
export declare class UserBadge extends React.Component<IProps, IState> {
    static defaultProps: DefaultProps;
    private $isMounted;
    constructor(props: IProps);
    render(): JSX.Element;
    componentDidMount: () => void;
    componentWillUnmount: () => void;
    private onPressUserBadge;
    private serUserInfo;
}
export {};
