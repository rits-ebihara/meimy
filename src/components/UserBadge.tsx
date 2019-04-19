import { Body, Button, Card, CardItem, Left, Right, Text, Thumbnail, View } from 'native-base';
import React from 'react';
import { Modal, ViewStyle } from 'react-native';

import eimAccount from '../account-manager/EimAccount';
import { IGroupDoc, IGroupProperties, IParsedResponse, IUserDoc, IUserProperties } from '../eim-service';
import groupFace from '../resources/group.png';
import dummyFace from '../resources/user.png';

interface IProps {
    userId: string;
    color?: string;
    badgeColor?: string;
    textColor?: string;
    style?: ViewStyle;
    type?: 'user' | 'group';
}

type DefaultProps = {
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

export class UserBadge extends React.Component<IProps, IState> {
    public static defaultProps: DefaultProps = {
        badgeColor: '#999',
        color: '#fff',
        type: 'user',
    };
    private $isMounted = false;
    public constructor(props: IProps) {
        super(props);
        this.state = {
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
        // const userInfoDialog = (
        // <TouchableOpacity style={styles.popUpContainer}
        //     onPress={this.onPressDialogScreen}>
        // </TouchableOpacity>
        // );
        return (
            <View style={this.props.style} >
                <Button rounded small color={this.props.badgeColor}
                    onPress={this.onPressUserBadge}>
                    <Thumbnail source={faceImage} small circular />
                    <Text>{this.state.userName}</Text>
                </Button>
                {/* {this.state.shownDetailDialog ? userInfoDialog : null} */}
                <Modal visible={this.state.shownDetailDialog}
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
                </Modal>
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
