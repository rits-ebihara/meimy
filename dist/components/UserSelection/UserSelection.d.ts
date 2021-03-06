import { Component } from 'react';
import { ViewStyle } from 'react-native';
import { DirectoryTypeKey, IUserBadgeOptionalProps } from '../UserBadge';
import { IFilter } from './UserSelectScreen';
interface IOptionalProps {
    editable: boolean;
    filter?: IFilter;
    multiple: boolean;
    style?: ViewStyle;
    userBadgeProp: {
        [key in keyof IUserBadgeOptionalProps]?: IUserBadgeOptionalProps[key];
    };
}
export interface IUserListItem {
    type: DirectoryTypeKey;
    userDocId: string;
}
export interface IUserSelectionProps extends Partial<IOptionalProps> {
    onChange: (userIds: IUserListItem[]) => void;
    selectedUsers: IUserListItem[];
}
export declare class UserSelection extends Component<IUserSelectionProps> {
    static defaultProps: IOptionalProps;
    private selectionModal;
    constructor(props: IUserSelectionProps);
    render(): JSX.Element;
    private addList;
    private onChange;
    private addButtonPress;
    private createUserList;
    private createUserListForArray;
    private onDelete;
}
export default UserSelection;
