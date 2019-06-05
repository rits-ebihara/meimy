import { Button, Icon, View } from 'native-base';
import React, { Component } from 'react';
import { ViewStyle } from 'react-native';

import { DirectoryTypeKey, IUserBadgeOptionalProps, IUserBadgeProps, UserBadge } from '../UserBadge';
import UserSelectScreen, { IFilter } from './UserSelectScreen';

interface IOptionalProps {
    addable: boolean;
    filter?: IFilter;
    multiple: boolean;
    style?: ViewStyle;
    userBadgeProp: { [key in keyof IUserBadgeOptionalProps]?: IUserBadgeOptionalProps[key] };
}
export interface IUserListItem {
    type: DirectoryTypeKey;
    userDocId: string;
}
export interface IUserSelectionProps extends Partial<IOptionalProps> {
    onChange: (userIds: IUserListItem[]) => void;
    selectedUsers: IUserListItem[];
    showAddButton: boolean;
}

const containerState: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
};

export class UserSelection extends Component<IUserSelectionProps> {
    public static defaultProps: IOptionalProps = {
        addable: false,
        multiple: false,
        userBadgeProp: {},
    }
    private selectionModal: UserSelectScreen | null = null;
    public constructor(props: IUserSelectionProps) {
        super(props);
    }
    public render() {
        const { props } = this;
        const style = Object.assign({}, containerState, props.style);
        return (
            <View style={style}>
                {this.createUserList()}
                {
                    this.props.showAddButton ?
                        <Button transparent icon success
                            key="add-button"
                            onPress={this.addButtonPress}>
                            <Icon name="md-add-circle" />
                        </Button> : null
                }
                <UserSelectScreen
                    key="user-select-screen"
                    ref={(me) => this.selectionModal = me}
                    filter={props.filter}
                    onSelect={this.addList} />
            </View>
        );
    };
    private addList = (userDocId: string, type: DirectoryTypeKey) => {
        const existUser = this.props.selectedUsers.find(u => u.userDocId === userDocId);
        if (existUser && this.props.multiple) {
            return;
        }
        const newItem = {
            type,
            userDocId,
        };
        const userList: IUserListItem[] =
            (this.props.multiple) ?
                [...this.props.selectedUsers, newItem] :
                [newItem];
        // すでに有れば無視
        this.onChange(userList);
    }
    private onChange = (userList: IUserListItem[]) => {
        this.props.onChange(userList);
    }
    private addButtonPress = () => {
        if (!!this.selectionModal) { this.selectionModal.show(); };
    }
    private createUserList = () => {
        const { props } = this;
        if (props.multiple) {
            return this.createUserListForArray(props.selectedUsers);
        } else {
            return this.createUserListForArray(props.selectedUsers.slice(0, 1));
        }
    }
    private createUserListForArray = (users: IUserListItem[]) => {
        return users.map(user => {
            const defaultStyle: ViewStyle = {
                margin: 4,
            };
            const userProps = (this.props as IOptionalProps).userBadgeProp;
            if (!!userProps.style) {
                userProps.style = Object.assign({}, defaultStyle, userProps.style);
            } else {
                userProps.style = defaultStyle;
            }
            const props: IUserBadgeProps = {
                ...userProps,
                userId: user.userDocId,
                onLongPress: this.onDelete,
            };
            return <UserBadge key={props.userId} {...props} />
        });

    }
    private onDelete = (userDocId: string) => {
        const { selectedUsers } = this.props;
        const index = selectedUsers.findIndex(a => a.userDocId === userDocId);
        if (index === -1) { return; }
        selectedUsers.splice(index, 1);
        this.onChange([...selectedUsers]);
    }
}

export default UserSelection
