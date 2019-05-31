import { Button, Icon, View } from 'native-base';
import React, { Component } from 'react';
import { ViewStyle } from 'react-native';

import { IUserBadgeProps, UserBadge } from '../UserBadge';
import UserSelectScreen, { IFilter } from './UserSelectScreen';

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
type DefaultProps = {
    [P in keyof IUserSelectionProps]?: IUserSelectionProps[P];
};

interface IState {
    showDialog: boolean;
}

const containerState: ViewStyle = {
    flexDirection: 'row',
};

export class UserSelection extends Component<IUserSelectionProps, IState> {
    public static defaultProps: DefaultProps = {
        addable: false,
        multiple: false,
    }
    public constructor(props: IUserSelectionProps) {
        super(props);
        this.state = {
            showDialog: false,
        };
    }
    public render() {
        const { props } = this;
        const style = Object.assign({}, containerState, props.style);
        return (
            <View style={style}>
                {this.createUserList()}
                <Button rounded icon success>
                    <Icon name="person-add" />
                </Button>
                {
                    this.state.showDialog ?
                        <UserSelectScreen filter={props.filter} />
                        : null
                }
            </View>
        );
    };
    private createUserList = () => {
        return this.props.selectedUsers.map(user => {
            const badgeColor = user.badgeColor || this.props.badgeColor;
            const textColor = user.textColor || this.props.textColor;
            const userBadgeStyle = Object.assign({}, this.props.userBadgeStyle || {}, user.style || {});
            const props: IUserBadgeProps = {
                badgeColor,
                textColor,
                style: userBadgeStyle,
                userId: user.userId,
                type: user.type,
            };
            return <UserBadge key={props.userId} {...props} />
        });
    }
}

export default UserSelection
