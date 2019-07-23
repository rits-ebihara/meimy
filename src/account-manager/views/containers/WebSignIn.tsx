import { Container, Toast } from 'native-base';
import React, { Component } from 'react';
import { NativeSyntheticEvent, NavState, WebView, WebViewMessageEventData } from 'react-native';
import CookieManager from 'react-native-cookies';
import { WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes';
import { connect } from 'react-redux';
import UrlParse from 'url-parse';

import { ICombinedNavProps, IProps } from '../../../redux-helper/redux-helper';
import { asyncSaveAccountAction } from '../../actions/AccountActions';
import NavigateActions from '../../actions/NavigateActions';
import { getConfig } from '../../Config';
import { IAccountManagerState } from '../../IAccountManagerState';
import { IAccountListState } from '../../states/IAccountLisState';
import { IAccountState } from '../../states/IAccountState';
import IWebSignInState from '../../states/IWebSignInState';

// import WebView from 'react-native-webview';
const config = getConfig();

const ricohSamlUrl = 'https://adfs.jp.ricoh.com/adfs/ls/';

interface IWebSignInProps extends IWebSignInState {
    accountListState: IAccountListState;
}
export type ThisProps = ICombinedNavProps<IWebSignInProps>;
export interface IWebSigninLocalState {
    uriSource: WebViewSourceUri;
}
interface IWebViewMessage {
    userId: string;
    password: string;
}


// 画面内にログインフォームを表示する
const eimLoginFormSet = `
(function(){
    var eimSys = document.getElementById("eim-system");
    if (!!eimSys) {
        eimSys.style.minWidth = "0";
    }
})();`;
// EIMフォーム ユーザーパスワードの取得
const getEimUserIdPass = `
(function(){
    var form = document.querySelector("[name=form1]");
    if (!form) { return; }
    form.addEventListener("submit", function() {
        var userNameInput = document.querySelector("[name=userName]");
        var passwordInput = document.querySelector("[name=password]");
        var userPass = {userId: '', password: ''};
        if (!!userNameInput) { userPass.userId = userNameInput.value; }
        if (!!passwordInput) { userPass.password = passwordInput.value; }
        window.postMessage(JSON.stringify(userPass));
    });
})();`;

// 365 SAML フォーム ユーザーパスワードの取得
const get365UserIdPass = `
(function(){
    var userNameInput = document.querySelector("#userNameInput");
    var passwordInput = document.querySelector("#passwordInput");
    var button = document.querySelector("#submitButton");
    if (!button || !userNameInput || !passwordInput) { return; }
    button.addEventListener("click", function() {
        var userPass = {userId: '', password: ''};
        userPass.userId = userNameInput.value;
        userPass.password = passwordInput.value;
        window.postMessage(JSON.stringify(userPass));
    });
})();`;

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class _WebSignIn extends Component<ThisProps, IWebSigninLocalState> {
    public static navigationOptions = () => {
        return {
            headerStyle: {
                backgroundColor: config.colorPalets.$colorPrimary3,
            },
            headerTintColor: config.colorPalets.$invertColor,
            headerTitle: '',
        };
    }
    private postedIdPass = false;
    private webview: WebView | null = null;
    private saveProp: ICombinedNavProps<IWebSignInProps> | undefined;
    public constructor(props: ThisProps) {
        super(props);
        const { account } = this.props.state;
        const domain = account ? account.siteDomain : '';
        let eimUrl = 'https://' + domain;
        if (!!account && account.authType === 'password') {
            eimUrl = eimUrl + '/services/login';
        }
        this.state = {
            uriSource: { uri: eimUrl },
        };
    }
    public render() {
        const { account } = this.props.state;
        if (!account) { return null; }
        const script = `
${account.authType === 'o365' ? '' : eimLoginFormSet}
${account.authType === 'o365' ? get365UserIdPass : getEimUserIdPass}
`;
        return (
            <Container>
                <WebView
                    url={this.state.uriSource.uri}
                    onLoadStart={this.onLoadStartWebView}
                    onMessage={this.onMessage}
                    ref={this.setRef}
                    injectedJavaScript={script} />
            </Container>
        );
    }
    public componentDidMount = () => {
        CookieManager.clearAll();
        // onLoadStartWebViewでは、state　がなくなる・・・？のでクラスメンバーとして保持する
        this.saveProp = this.props;
    }
    private onMessage = (event: NativeSyntheticEvent<WebViewMessageEventData>) => {
        const { data: message } = event.nativeEvent;
        const messageData = JSON.parse(message) as IWebViewMessage;
        /** ID/Password の保存 */
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const account = this.props.state.account!;
        account.userId = messageData.userId;
        account.password = messageData.password;
        asyncSaveAccountAction(account, this.props.dispatch);
    }
    private setRef = (control: WebView) => { this.webview = control; }
    private postIdPassEimForm = (url: string, account: IAccountState) => {
        // services/v1/login
        if (this.postedIdPass) { return false; }
        if (!url.endsWith('/services/login')) { return false; }
        if (!account.userId || !account.password) {
            // 空の場合は初回処理の場合なので、POST処理しない
            this.postedIdPass = true;
            return false;
        }
        const body = `userName=${encodeURIComponent(account.userId)}`
            + `&password=${encodeURIComponent(account.password)}`;
        const postUrl = UrlParse(url);
        postUrl.set('pathname', '/services/v1/login');
        const uriSource: WebViewSourceUri = {
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            method: 'POST',
            uri: postUrl.href,
        };
        this.postedIdPass = true;
        this.setState({
            uriSource,
        });
        return true;
    }
    private postIdPassFor365 = (url: string, account: IAccountState): boolean => {
        if (this.postedIdPass) { return false; }
        if (!url.startsWith(ricohSamlUrl)) { return false; }
        if (!account.userId || !account.password) {
            // 空の場合は初回処理の場合なので、POST処理しない
            this.postedIdPass = true;
            return false;
        }
        const body = `AuthMethod=${encodeURIComponent('FormsAuthentication')}`
            + `&UserName=${encodeURIComponent(account.userId)}`
            + `&Password=${encodeURIComponent(account.password)}`;
        const uriSource: WebViewSourceUri = {
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            method: 'POST',
            uri: url,
        };
        this.postedIdPass = true;
        this.setState({
            uriSource,
        });
        return true;
    }
    private onLoadStartWebView = async (e: NavState) => {
        const { saveProp } = this;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const account = saveProp!.state.account!;
        // 引数の型が、 @types と異なるのでキャストし直す
        const navState = (e as NativeSyntheticEvent<NavState>).nativeEvent;
        const { url } = navState;
        if (!url) { return 'no url'; }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const webview = this.webview!;
        if (account.authType === 'o365' && this.postIdPassFor365(url, account)) {
            webview.stopLoading();
            return 'auth o365';
        }
        if (account.authType === 'password' && this.postIdPassEimForm(url, account)) {
            webview.stopLoading();
            return 'auth password';
        }
        // console.log(JSON.stringify(navState.nativeEvent));
        const cookie = await CookieManager.get(url);
        if (!cookie.APISID) {
            return 'no token';
        }
        // トークンのクッキーが取得できたら成功
        webview.stopLoading();
        Toast.show({ text: '認証に成功しました。', type: 'success' });
        account.eimToken = ['APISID=' + cookie.APISID];
        await asyncSaveAccountAction(account, this.props.dispatch);
        // if (!this.saveProp) { return; }

        await NavigateActions.navigateForLink(
            this.props.state.accountListState,
            {
                siteDomain: account.siteDomain,
                siteName: account.siteName,
                tokens: account.eimToken,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            }, saveProp!.dispatch, saveProp!.navigation, true);
        return 'set token';
    }
}

const mapStateToProps = (state: IAccountManagerState): IProps<IWebSignInProps> => {
    return {
        state: { ...state.webSignIn, accountListState: state.accountList },
    };
};

export const __private__ = {
    mapStateToProps,
};

export default connect(mapStateToProps)(_WebSignIn);
