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
    flexWrap: 'wrap',
};

export class UserSelection extends Component<IUserSelectionProps, IState> {
    public static defaultProps: DefaultProps = {
        addable: false,
        multiple: false,
    }
    private selectionModal: UserSelectScreen | null = null;
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
                <Button transparent icon success
                    onPress={this.addButtonPress}>
                    <Icon name="md-add-circle" />
                </Button>
                <UserSelectScreen
                    ref={(me) => this.selectionModal = me}
                    filter={props.filter} />
            </View>
        );
    };
    private addButtonPress = () => {
        if (!!this.selectionModal) { this.selectionModal.show(); };
    }
    private createUserList = () => {
        return this.props.selectedUsers.map(user => {
            const badgeColor = user.badgeColor || this.props.badgeColor;
            const textColor = user.textColor || this.props.textColor;
            const defaultStyle: ViewStyle = {
                margin: 4,
            };
            const userBadgeStyle = Object.assign(
                {}, defaultStyle,
                this.props.userBadgeStyle || {}, user.style || {});
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
