import { Component } from 'react';
import { ViewStyle } from 'react-native';
import { IUserBadgeProps } from '../UserBadge';
import { IFilter } from './UserSelectScreen';
export interface IUserSelectionProps {
    selectedUsers: IUserBadgeProps[];
    badgeColor?: string;
    textColor?: string;
    userBadgeStyle?: ViewStyle;
    multiple?: boolean;
    addable?: boolean;
    filter?: IFilter;
    style?: ViewStyle;
    onChange?: (userIds: string[]) => void;
}
declare type DefaultProps = {
    [P in keyof IUserSelectionProps]?: IUserSelectionProps[P];
};
interface IState {
    showDialog: boolean;
}
export declare class UserSelection extends Component<IUserSelectionProps, IState> {
    static defaultProps: DefaultProps;
    private selectionModal;
    constructor(props: IUserSelectionProps);
    render(): JSX.Element;
    private addButtonPress;
    private createUserList;
}
export default UserSelection;
