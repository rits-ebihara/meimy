import clone from 'clone';
import { Body, Button, Card, CardItem, Left, Right, Text, Thumbnail, View } from 'native-base';
import React from 'react';
import { ImageSourcePropType, Modal, ViewStyle } from 'react-native';

import { getEimAccount } from '../account-manager/EimAccount';
import { IGroupDoc, IGroupProperties, IUserDoc, IUserProperties } from '../eim-service/EIMDocInterface';
import { IParsedResponse } from '../eim-service/IResponse';
import groupFace from '../resources/group.png';
import dummyFace from '../resources/user.png';

export type DirectoryTypeKey = 'user' | 'group' | 'organization';

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
export class UserBadge extends React.Component<IUserBadgeProps, IState> {
    public static defaultProps: IUserBadgeOptionalProps = {
        badgeColor: '#666',
        textColor: '#fff',
        type: 'user',
        onLongPress: (_userId: string) => { },
    };
    private $isMounted = false;
    public constructor(props: IUserBadgeProps) {
        super(props);
        this.state = {
            userId: props.userId,
            shownDetailDialog: false,
            type: props.type || 'user',
        };
    }
    public render() {
        const altFace = this.props.type === 'user' ? dummyFace : groupFace;
        const faceImage = this.state.userFaceUrl ?
            {
                uri: this.state.userFaceUrl,
            } : altFace;
        return (
            <View style={this.props.style} >
                <Button rounded small color={this.props.badgeColor}
                    onLongPress={this.onLongPressUserBadge}
                    onPress={this.onPressUserBadge}>
                    <Thumbnail source={faceImage} small circular />
                    <Text>{this.state.userName}</Text>
                </Button>
                {/* {this.state.shownDetailDialog ? userInfoDialog : null} */}
                {this.userInfoPanel(faceImage)}
            </View >
        );
    }
    public componentDidMount = () => {
        this.$isMounted = true;
        (async () => {
            if (!this.$isMounted || !this.props.userId) {
                return;
            }
            let result: IParsedResponse<IUserDoc | IGroupDoc>;
            const eimAccount = getEimAccount();
            result = await eimAccount.getServiceAdapter().getUserDocById(eimAccount.eimTokens, this.props.userId);
            if (!result.parsedBody) {
                return;
            }
            const { properties } = result.parsedBody;
            // ユーザーか、グループかの判定
            if ((properties as IUserProperties).loginUserName) {
                const userProps = properties as IUserProperties;
                this.serUserInfo(userProps);
            } else {
                const groupProps = properties as IGroupProperties;
                this.setState({
                    userName: groupProps.label,
                    userOrg: groupProps.fullLabel,
                });
            }
        })();
    }
    public componentWillUnmount = () => {
        this.$isMounted = false;
    }
    private onPressUserBadge = () => {
        this.setState({
            shownDetailDialog: true,
        });
    }
    private onLongPressUserBadge = () => {
        if (!this.props.onLongPress) { return; }
        const state = clone(this.state);
        this.props.onLongPress(state.userId);
    }

    private userInfoPanel = (faceImage: ImageSourcePropType) => {
        return <Modal visible={this.state.shownDetailDialog}
            animationType="slide" transparent
            onRequestClose={() => { this.setState({ shownDetailDialog: false }); }}>
            <Card style={{ marginTop: 50 }}>
                <CardItem>
                    <Body style={{ flex: 1, flexDirection: 'row' }}>
                        <Thumbnail source={faceImage} large square style={{ flexShrink: 0, flexGrow: 0 }} />
                        <View style={{ marginLeft: 4, flexShrink: 1, flexGrow: 1 }}>
                            <Text>{this.state.userName}</Text>
                            <Text>{this.state.userOrg}</Text>
                            <Text>{this.state.userEMail}</Text>
                        </View>
                    </Body>
                </CardItem>
                <CardItem footer>
                    <Left></Left>
                    <Text></Text>
                    <Right>
                        <Button transparent
                            onPress={() => { this.setState({ shownDetailDialog: false }); }}>
                            <Text style={{ color: this.props.textColor }}>閉じる</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        </Modal>;
    }
    private serUserInfo(userProps: IUserProperties) {
        this.setState({
            userEMail: userProps.mailAddress,
            userName: userProps.displayName,
            userOrg: userProps.profile &&
                userProps.profile.department &&
                userProps.profile.department.properties &&
                userProps.profile.department.properties.fullLabel || '',
        });
        if (userProps.faceImage) {
            const eimAccount = getEimAccount();
            eimAccount.getServiceAdapter().getAttachmentFile(eimAccount.eimTokens, userProps.faceImage)
                .then((response) => {
                    if (response) {
                        this.setState({
                            userFaceUrl: response.url,
                        });
                    }
                });
        }
    }
}
