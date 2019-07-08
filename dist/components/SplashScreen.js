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
const react_native_device_info_1 = __importDefault(require("react-native-device-info"));
const url_parse_1 = __importDefault(require("url-parse"));
const NavigateActions_1 = __importDefault(require("../account-manager/actions/NavigateActions"));
const Config_1 = require("../account-manager/Config");
const EimAccount_1 = require("../account-manager/EimAccount");
//#region Styles
class SplashScreen extends react_1.Component {
    constructor() {
        super(...arguments);
        this.runOnLink = false;
        this.componentDidMount = async () => {
            react_native_1.Linking.addEventListener('url', this.urlEvent);
            this.checkConnectOnResume();
            await react_native_1.Linking.getInitialURL().then(this.linkInitialURL);
        };
        this.checkConnectOnResume = () => {
            react_native_1.AppState.addEventListener('change', this.reloginAnnounce);
        };
        this.reloginAnnounce = async (state) => {
            const eimAccount = EimAccount_1.getEimAccount();
            if (state === 'active') {
                const token = eimAccount.eimTokens;
                if (token.length !== 0) {
                    const result = await eimAccount.getServiceAdapter().validateToken(token);
                    if (!result) {
                        eimAccount.eimTokens = [];
                        native_base_1.Toast.show({
                            text: 'サーバーとの接続が切れました。\n再ログインしてください。',
                        });
                        NavigateActions_1.default.openAccountManager(this.props.navigation, this.props.dispatch);
                    }
                }
            }
        };
        this.linkInitialURL = async (url) => {
            // ディープリンクから起動された場合
            // 通常起動の場合も反応する。その場合 url = null となる。
            if (!url || this.runOnLink) {
                // スプラッシュを表示するため、インターバルを取る
                setTimeout(() => {
                    NavigateActions_1.default.openAccountManager(this.props.navigation, this.props.dispatch);
                }, 500);
                return;
            }
            this.runOnLink = true;
            const receiveUrl = url_parse_1.default(url, '', true);
            const { query } = receiveUrl;
            if (!!query.link && query.hash) {
                NavigateActions_1.default.openAccountManager(this.props.navigation, this.props.dispatch, query.link, query.hash);
            }
        };
        this.urlEvent = async (e) => {
            const urlString = e.url;
            const receiveUrl = url_parse_1.default(urlString, '', true);
            const { query } = receiveUrl;
            if (!query) {
                return;
            }
            // スプラッシュ画面を表示するため、インターバルを置く
            if (this.didComeFromAccountManager(receiveUrl.hostname, query)) {
                await this.fromAccountManager(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                query.token, query.domain, query.appkey, query.siteName, query.link);
            }
            else if (!!query.link
                && query.hash) {
                // メール等文書リンクから来た場合
                NavigateActions_1.default.openAccountManager(this.props.navigation, this.props.dispatch, query.link, query.hash);
            }
        };
        this.didComeFromAccountManager = (hostName, query) => {
            return (hostName === 'authed'
                && !!query.domain
                && !!query.appkey
                && !!query.token);
        };
        this.fromAccountManager = async (token, domain, appKey, siteName, link) => {
            const config = Config_1.getConfig();
            const eimAccount = EimAccount_1.getEimAccount();
            eimAccount.eimTokens = token.split(',');
            eimAccount.domain = domain;
            eimAccount.appKey = appKey;
            eimAccount.siteName = siteName || domain;
            eimAccount.user = undefined;
            eimAccount.save();
            await eimAccount.loadUser();
            if (!!link) {
                const linkUrl = url_parse_1.default(link);
                const hashes = linkUrl.hash.split('/');
                if (hashes.length === 5) {
                    const navProps = {
                        parameter: hashes[4],
                    };
                    this.props.navigation.navigate(config.startPage, navProps);
                }
                return;
            }
            else {
                this.props.navigation.navigate(config.startPage);
            }
        };
    }
    render() {
        const config = Config_1.getConfig();
        const { theme } = config;
        const containerStyle = {
            alignItems: 'center',
            backgroundColor: theme.brandPrimary,
            justifyContent: 'center',
        };
        const appNameStyle = {
            color: theme.inverseTextColor,
            fontSize: 32,
        };
        const versionStyle = {
            color: theme.inverseTextColor,
            fontSize: 20,
            position: 'absolute',
            top: 0,
            alignSelf: 'flex-end',
        };
        return (react_1.default.createElement(native_base_1.Container, { style: containerStyle },
            react_1.default.createElement(native_base_1.Text, { style: versionStyle },
                "ver.",
                react_native_device_info_1.default.getVersion()),
            react_1.default.createElement(native_base_1.View, null,
                react_1.default.createElement(native_base_1.Text, { style: appNameStyle }, this.props.state.appName))));
    }
}
exports.SplashScreen = SplashScreen;
// eslint-disable-next-line max-len
// adb shell am start -a android.intent.action.VIEW "eimapplink-apptest1://apptest1/?link=https%3A%2F%2Fapp-dev54.ope.azure.ricoh-eim.com%2F\&hash=%2Fapps%2FDWS%2Fdocuments%2Fa7c2cee5e03a42538e90bec4df8789d8"
