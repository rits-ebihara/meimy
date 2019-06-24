import { Button, Icon, Text, Thumbnail, View } from 'native-base';
import React, { Component } from 'react';
import { ImageURISource, ViewStyle } from 'react-native';
import { DrawerItemsProps } from 'react-navigation';

import { getEimAccount } from '../account-manager/EimAccount';
import dummyAvatar from '../resources/user.png';

// import { app, routePageNames } from '../../Commons';
// import theme, { colorPallet } from '../Styles';

export interface IDrawerViewProps extends DrawerItemsProps {
    borderColor: string;
    buttonColor: string;
    appDisplayName: string;
    appVersion: string;
    splashPageName: string;
}

export interface ILocalState {
    avatarFaceUrl?: ImageURISource;
}

export class DrawerContent extends Component<IDrawerViewProps, ILocalState> {
    private $isMounted = false;
    public constructor(props: IDrawerViewProps) {
        super(props);
        this.state = {};
    }
    public render() {
        const viewStyle: ViewStyle = {
            borderBottomColor: this.props.borderColor,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            padding: 10,
        };
        const rowStyle: ViewStyle = Object.assign<{}, ViewStyle, ViewStyle>({}, viewStyle, {
            flexDirection: 'row',
        });
        const colStyle: ViewStyle = Object.assign<{}, ViewStyle, ViewStyle>({}, viewStyle, {
            flexDirection: 'column',
        });
        const eimAccount = getEimAccount();
        if (!eimAccount.user) {
            return null;
        }
        const { user } = eimAccount;
        return (
            <View>
                <View style={{ flexDirection: 'row-reverse' }}>
                    <Button
                        key="closeButton"
                        transparent
                        onPress={() => this.props.navigation.toggleDrawer()}>
                        <Text>閉じる</Text>
                    </Button>
                </View>
                <View style={rowStyle}>
                    <View style={{ width: 88 }}>
                        <Thumbnail circular large source={this.state.avatarFaceUrl || dummyAvatar} />
                    </View>
                    <View style={{ width: 180 }}>
                        <Text>{user.properties.displayName}</Text>
                        <Text>{eimAccount.getDepartmentName()}</Text>
                    </View>
                </View>
                <View style={colStyle}>
                    <Text>{}</Text>
                    <Text note>{eimAccount.domain}</Text>
                    <Button
                        bordered color={this.props.buttonColor} iconLeft rounded
                        style={{ alignSelf: 'center', margin: 10 }}
                        onPress={this.onPressChangeSite.bind(this)}>
                        <Icon name="md-swap" />
                        <Text>接続先の切り替え</Text>
                    </Button>
                </View>
                <View style={colStyle} >
                    <Text note>このアプリについて</Text>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}>{this.props.appDisplayName}</Text>
                    <Text style={{ alignSelf: 'flex-end' }}>ver.{this.props.appVersion}</Text>
                </View>
            </View>
        );
    }
    public componentDidMount = async () => {
        this.$isMounted = true;
        const eimAccount = getEimAccount();
        const { user } = eimAccount;
        const faceImage = user ? user.properties.faceImage : null;
        if (!faceImage) {
            return;
        }
        return eimAccount.getServiceAdapter()
            .getAttachmentFile(eimAccount.eimTokens, faceImage)
            .then((result) => {
                if (!this.$isMounted) { return; }
                this.setState({
                    avatarFaceUrl: {
                        uri: result.url,
                    },
                });
            });
    }
    public componentWillUnmount = () => {
        this.$isMounted = false;
    }
    public onPressChangeSite = async () => {
        const eimAccount = getEimAccount();
        eimAccount.clear();
        await eimAccount.save();
        this.props.navigation.navigate(this.props.splashPageName);
    }

}
