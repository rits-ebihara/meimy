"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_cookies_1 = __importDefault(require("react-native-cookies"));
const react_redux_1 = require("react-redux");
const url_parse_1 = __importDefault(require("url-parse"));
const AccountActions_1 = require("../../actions/AccountActions");
const NavigateActions_1 = __importDefault(require("../../actions/NavigateActions"));
const Config_1 = require("../../Config");
const WebView_1 = __importDefault(require("../../../components/WebView"));
const IsiOS = react_native_1.Platform.OS === 'ios';
const useWebKit = IsiOS;
const config = Config_1.getConfig();
const ricohSamlUrl = 'https://adfs.jp.ricoh.com/adfs/ls/';
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
        // window.postMessage(JSON.stringify(userPass));
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
        setTimeout(function() {
            window.postMessage(JSON.stringify(userPass));
        }, 0);
    });
})();`;
// eslint-disable-next-line @typescript-eslint/class-name-casing
class _WebSignIn extends react_1.Component {
    constructor(props) {
        super(props);
        this.postedIdPass = false;
        this.webview = null;
        this.componentDidMount = () => {
            react_native_cookies_1.default.clearAll(useWebKit);
            // onLoadStartWebViewでは、state　がなくなる・・・？のでクラスメンバーとして保持する
            this.saveProp = this.props;
        };
        this.onMessage = (event) => {
            let { data: message } = event.nativeEvent;
            if (IsiOS) {
                // iOS では URIエンコードを２回実施されたものが返ってくる。React Native のバグ？
                message = decodeURIComponent(decodeURIComponent(message));
            }
            const messageData = JSON.parse(message);
            /** ID/Password の保存 */
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const account = this.props.state.account;
            account.userId = messageData.userId;
            account.password = messageData.password;
            AccountActions_1.asyncSaveAccountAction(account, this.props.dispatch);
        };
        this.setRef = (control) => { this.webview = control; };
        this.postIdPassEimForm = (url, account) => {
            // services/v1/login
            if (this.postedIdPass) {
                return false;
            }
            if (!url.endsWith('/services/login')) {
                return false;
            }
            if (!account.userId || !account.password) {
                // 空の場合は初回処理の場合なので、POST処理しない
                this.postedIdPass = true;
                return false;
            }
            const body = `userName=${encodeURIComponent(account.userId)}`
                + `&password=${encodeURIComponent(account.password)}`;
            const postUrl = url_parse_1.default(url);
            postUrl.set('pathname', '/services/v1/login');
            const uriSource = {
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
        };
        this.postIdPassFor365 = (url, account) => {
            if (this.postedIdPass) {
                return false;
            }
            if (!url.startsWith(ricohSamlUrl)) {
                return false;
            }
            if (!account.userId || !account.password) {
                // 空の場合は初回処理の場合なので、POST処理しない
                this.postedIdPass = true;
                return false;
            }
            const body = `AuthMethod=${encodeURIComponent('FormsAuthentication')}`
                + `&UserName=${encodeURIComponent(account.userId)}`
                + `&Password=${encodeURIComponent(account.password)}`;
            const uriSource = {
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
        };
        this.onLoadStartWebView = async (e) => {
            const { saveProp } = this;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const account = saveProp.state.account;
            // 引数の型が、 @types と異なるのでキャストし直す
            const navState = e.nativeEvent;
            const { url } = navState;
            if (!url) {
                return 'no url';
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const webview = this.webview;
            if (account.authType === 'o365' && this.postIdPassFor365(url, account)) {
                webview.stopLoading();
                return 'auth o365';
            }
            if (account.authType === 'password' && this.postIdPassEimForm(url, account)) {
                webview.stopLoading();
                return 'auth password';
            }
            // console.log(JSON.stringify(navState.nativeEvent));
            const cookie = await react_native_cookies_1.default.get(url, useWebKit);
            if (!cookie.APISID) {
                return 'no token';
            }
            // トークンのクッキーが取得できたら成功
            webview.stopLoading();
            native_base_1.Toast.show({ text: '認証に成功しました。', type: 'success' });
            account.eimToken = ['APISID=' + cookie.APISID];
            await AccountActions_1.asyncSaveAccountAction(account, this.props.dispatch);
            // if (!this.saveProp) { return; }
            await NavigateActions_1.default.navigateForLink(this.props.state.accountListState, {
                siteDomain: account.siteDomain,
                siteName: account.siteName,
                tokens: account.eimToken,
            }, saveProp.dispatch, saveProp.navigation, true);
            return 'set token';
        };
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
    render() {
        const { account } = this.props.state;
        if (!account) {
            return null;
        }
        const script = `
${account.authType === 'o365' ? '' : eimLoginFormSet}
${account.authType === 'o365' ? get365UserIdPass : getEimUserIdPass}
`;
        return (react_1.default.createElement(native_base_1.Container, null,
            react_1.default.createElement(WebView_1.default, { source: this.state.uriSource, onLoadStart: this.onLoadStartWebView, onMessage: this.onMessage, ref: this.setRef, injectedJavaScript: script }),
            ";"));
    }
}
_WebSignIn.navigationOptions = () => {
    return {
        headerStyle: {
            backgroundColor: config.colorPalets.$colorPrimary3,
        },
        headerTintColor: config.colorPalets.$invertColor,
        headerTitle: '',
    };
};
exports._WebSignIn = _WebSignIn;
const mapStateToProps = (state) => {
    return {
        state: { ...state.webSignIn, accountListState: state.accountList },
    };
};
exports.__private__ = {
    mapStateToProps,
};
exports.default = react_redux_1.connect(mapStateToProps)(_WebSignIn);
