import { Container, Text, View } from 'native-base';
import React, { Component } from 'react';
import { Linking, TextStyle, ViewStyle } from 'react-native';
import DevInfo from 'react-native-device-info';
import UrlParse from 'url-parse';

import { ICombinedNavProps } from '..';
import { config } from '../account-manager';
import navigateController from '../account-manager/actions/NavigateActions';
import eimAccount from '../account-manager/EimAccount';

let runOnLink = false;
export interface INavProps {
    parameter: string;
}

export interface ISplashState {
    appName: string;
}
//#region Styles
export abstract class SplashScreen<T extends ISplashState> extends Component<ICombinedNavProps<T>> {
    public render() {
        const { theme } = config;
        const containerStyle: ViewStyle = {
            alignItems: 'center',
            backgroundColor: theme.brandPrimary,
            justifyContent: 'center',
        };

        const appNameStyle: TextStyle = {
            color: theme.inverseTextColor,
            fontSize: 32,
        };
        const versionStyle: TextStyle = {
            color: theme.inverseTextColor,
            fontSize: 20,
            position: 'absolute',
            top: 0,
            alignSelf: 'flex-end',
        }
        return (
            <Container style={containerStyle}>
                <Text style={versionStyle}>ver.{DevInfo.getVersion()}</Text>
                <View>
                    <Text style={appNameStyle}>{this.props.state.appName}</Text>
                </View>
            </Container>
        );
    }
    public componentDidMount = () => {
        Linking.getInitialURL().then(this.linkInitialURL);
        Linking.addEventListener('url', this.urlEvent);
    }
    private linkInitialURL = async (url: string | null) => {
        // ディープリンクから起動された場合
        // 通常起動の場合も反応する。その場合 url = null となる。
        if (!url || runOnLink) {
            // スプラッシュを表示するため、インターバルを取る
            setTimeout(() => {
                navigateController.openAccountManager(this.props.navigation, this.props.dispatch);
            }, 500);
            return;
        }
        runOnLink = true;
        const receiveUrl = UrlParse(url, '', true);
        const { query } = receiveUrl;
        if (!!query.link && query.hash) {
            navigateController.openAccountManager(this.props.navigation,
                this.props.dispatch,
                query.link,
                query.hash);
        }
    }
    private urlEvent = async (e: { url: string }) => {
        const urlString = e.url;
        const receiveUrl = UrlParse(urlString, '', true);
        const { query } = receiveUrl;
        if (!query) { return; }
        // スプラッシュ画面を表示するため、インターバルを置く
        if (this.didComeFromAccountManager(
            receiveUrl.hostname, query)) {
            await this.fromAccountManager(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                query.token!, query.domain!, query.appkey!,
                query.siteName, query.link,
            );
        } else if (!!query.link
            && query.hash) {
            // メール等文書リンクから来た場合
            navigateController.openAccountManager(
                this.props.navigation, this.props.dispatch,
                query.link, query.hash);
        }
    }
    private didComeFromAccountManager = (hostName: string, query: { [key: string]: string | undefined }) => {
        return (hostName === 'authed'
            && !!query.domain
            && !!query.appkey
            && !!query.token);
    }
    private fromAccountManager = async (
        token: string, domain: string,
        appKey: string, siteName: string | undefined,
        link: string | undefined,
    ) => {
        eimAccount.eimTokens = token.split(',');
        eimAccount.domain = domain;
        eimAccount.appKey = appKey;
        eimAccount.siteName = siteName || domain;
        eimAccount.user = undefined;
        eimAccount.save();
        await eimAccount.loadUser();
        if (!!link) {
            const linkUrl = UrlParse(link);
            const hashes = linkUrl.hash.split('/');
            if (hashes.length === 5) {
                const navProps: INavProps = {
                    parameter: hashes[4],
                };
                this.props.navigation.navigate(config.startPage, navProps);
            }
            return;
        } else {
            this.props.navigation.navigate(config.startPage);
        }
    }
}
// eslint-disable-next-line max-len
// adb shell am start -a android.intent.action.VIEW "eimapplink-apptest1://apptest1/?link=https%3A%2F%2Fapp-dev54.ope.azure.ricoh-eim.com%2F\&hash=%2Fapps%2FDWS%2Fdocuments%2Fa7c2cee5e03a42538e90bec4df8789d8"
