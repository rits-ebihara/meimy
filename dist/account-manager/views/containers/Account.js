"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const console = require("console");
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const shortid_1 = __importDefault(require("shortid"));
const FloatingButton_1 = require("../../../components/FloatingButton/FloatingButton");
const EIMServiceAdapter_1 = require("../../../eim-service/EIMServiceAdapter");
const AccountActions_1 = require("../../actions/AccountActions");
const NavigateActions_1 = __importDefault(require("../../actions/NavigateActions"));
const WebSignInActions_1 = require("../../actions/WebSignInActions");
const Config_1 = require("../../Config");
const RoutePageNames_1 = __importDefault(require("../../RoutePageNames"));
const config = Config_1.getConfig();
// eslint-disable-next-line @typescript-eslint/class-name-casing
class _Account extends react_1.Component {
    constructor(props) {
        super(props);
        this.backupState = null;
        this.render = () => {
            const { theme, colorPalets } = config;
            const { state } = this;
            const errorMessageStyle = {
                color: theme.brandDanger,
                fontSize: 12,
            };
            const style = react_native_1.StyleSheet.create({
                textboxStyle: {
                    color: (state.mode === 'view') ? colorPalets.$frontDisabledColor : colorPalets.$frontColor,
                },
            });
            const viewingMenu = react_1.default.createElement(FloatingButton_1.FloatingButton, { key: "edit_button", iconName: "create", primaryButtonColor: theme.brandPrimary, onPress: this.onPressEdit });
            const editingMenu = [
                react_1.default.createElement(FloatingButton_1.FloatingButton, { key: "save_button", iconName: "md-checkmark", iconType: "Ionicons", onPress: this.onPressSave, primaryButtonColor: theme.brandSuccess }),
                react_1.default.createElement(FloatingButton_1.FloatingButton, { key: "cancel", iconName: "close", primaryButtonColor: theme.brandDanger, onPress: this.onPressCancelEdit, position: "bottom-left" }),
            ];
            const { siteNameErrorMessage, siteErrorMessage, hasError } = this.createErrorMessages(state);
            return (react_1.default.createElement(native_base_1.Container, null,
                react_1.default.createElement(native_base_1.Content, null,
                    react_1.default.createElement(native_base_1.Card, { style: { paddingBottom: 24 } },
                        react_1.default.createElement(native_base_1.Item, { stackedLabel: true },
                            react_1.default.createElement(native_base_1.Label, null, "\u30B5\u30A4\u30C8\u540D\u79F0"),
                            react_1.default.createElement(native_base_1.Input, { key: "site_name", value: state.siteName, editable: state.mode === 'edit', style: style.textboxStyle, onChangeText: (text) => { this.onChangeState('siteName', text); } })),
                        react_1.default.createElement(native_base_1.Text, { style: errorMessageStyle }, siteNameErrorMessage),
                        react_1.default.createElement(native_base_1.Item, { stackedLabel: true },
                            react_1.default.createElement(native_base_1.Label, null, "\u30B5\u30A4\u30C8\u30C9\u30E1\u30A4\u30F3"),
                            react_1.default.createElement(native_base_1.Input, { key: "site_domain", value: state.siteDomain, editable: state.mode === 'edit', style: style.textboxStyle, keyboardType: "url", autoCapitalize: "none", onChangeText: (text) => { this.onChangeState('siteDomain', text); } })),
                        react_1.default.createElement(native_base_1.Text, { style: errorMessageStyle }, siteErrorMessage),
                        react_1.default.createElement(native_base_1.Item, { style: { marginTop: 12, marginBottom: 12 } },
                            react_1.default.createElement(native_base_1.Label, null, "\u8A8D\u8A3C\u65B9\u5F0F"),
                            react_1.default.createElement(native_base_1.Picker, { key: "auth-type", mode: "dropdown", enabled: state.mode === 'edit', iosIcon: react_1.default.createElement(native_base_1.Icon, { name: "ios-arrow-down" }), textStyle: style.textboxStyle, selectedValue: state.authType, style: react_native_1.Platform.OS === 'android' ? style.textboxStyle : {}, onValueChange: (text) => { this.onChangeState('authType', text); } },
                                react_1.default.createElement(native_base_1.Picker.Item, { label: "\u30D1\u30B9\u30EF\u30FC\u30C9", value: "password" }),
                                react_1.default.createElement(native_base_1.Picker.Item, { label: "Office365\u8A8D\u8A3C", value: "o365" }))),
                        this.createSignInButton(hasError))),
                (state.mode === 'view') ? viewingMenu : editingMenu));
        };
        this.componentDidMount = () => {
            (async () => { this.inputCheck(); })();
            this.props.navigation.setParams({ remove: this.onPressRemove });
            this.props.navigation.setParams({
                removeButtonStyle: !!this.state.id ? {} : { display: 'none' },
            });
        };
        this.componentDidUpdate = (_preProp, preState) => {
            if (this.state.id !== preState.id) {
                this.props.navigation.setParams({
                    removeButtonStyle: !!this.state.id ? {} : { display: 'none' },
                });
            }
        };
        this.createSignInButton = (hasError) => {
            const { state } = this;
            const buttonStyle = {
                marginTop: 24,
            };
            if (state.mode === 'view') {
                return react_1.default.createElement(native_base_1.Button, { key: "sign-in-button", block: true, rounded: true, success: true, style: buttonStyle, disabled: hasError, onPress: this.onPressConnect },
                    react_1.default.createElement(native_base_1.Text, null, "\u30B5\u30A4\u30F3\u30A4\u30F3"));
            }
            return null;
        };
        this.onPressEdit = () => {
            // キャンセルされたときのために値を保存しておく
            this.backupState = clone_1.default(this.state);
            this.setState({ mode: 'edit' });
        };
        this.onPressCancelEdit = () => {
            // 新規作成時の場合は、前の画面に戻る
            if (!this.state.id) {
                this.props.navigation.pop();
                return;
            }
            // 保持しておいた値に戻す
            this.setState(this.backupState);
            this.backupState = null;
        };
        this.onPressRemove = () => {
            const me = this;
            react_native_1.Alert.alert('アカウントの削除', `${this.state.siteName}を削除して良いですか?`, [
                {
                    style: 'default',
                    text: 'キャンセル',
                },
                {
                    onPress: () => {
                        AccountActions_1.asyncRemoveAccountAction(me.state.id, me.props.dispatch, me.navPop);
                    },
                    style: 'destructive',
                    text: '削除',
                },
            ]);
        };
        this.navPop = () => {
            this.props.navigation.pop();
        };
        this.onPressConnect = async () => {
            // トークンがあればそれを検証
            const client = new EIMServiceAdapter_1.EIMServiceAdapter(this.state.siteDomain);
            if (this.state.eimToken.length !== 0) {
                const tokenResult = await client.validateToken(this.state.eimToken);
                if (tokenResult) {
                    await this.successConnect(this.state.eimToken);
                    return;
                }
            }
            // if (this.state.authType === 'password') {
            //     this.setState({ shownLoginDialog: true });
            // } else {
            this.props.dispatch(WebSignInActions_1.createShowWebPageAction(this.state));
            this.props.navigation.navigate(RoutePageNames_1.default.webSignInPageName);
            // }
        };
        this.changeInputState = {
            siteName: (value) => {
                this.setState({ siteName: value });
            },
            siteDomain: (value) => {
                this.setState({ siteDomain: value });
            },
            authType: (value) => {
                this.setState({ authType: value });
            },
        };
        this.onChangeState = (key, value) => {
            this.changeInputState[key](value);
            setTimeout(this.inputCheck, 100);
        };
        this.onPressSave = async () => {
            if (!this.inputCheck()) {
                return;
            }
            const account = clone_1.default(this.state);
            if (!account.id) {
                account.id = shortid_1.default();
            }
            // サイトが変更されることもあるので、トークン、ユーザー、パスワードは削除する
            account.eimToken = [];
            account.password = undefined;
            account.userId = undefined;
            // データを保存
            await AccountActions_1.asyncSaveAccountAction(account, this.props.dispatch);
            this.setState(account);
            this.setState({ mode: 'view' });
        };
        this.inputCheck = (state) => {
            const targetState = state || this.state;
            let result = true;
            const changeState = {
                siteDomainError: false,
                siteNameError: false,
            };
            // サイト名 必須
            if (!targetState.siteName) {
                result = false;
                changeState.siteNameError = true;
            }
            // ドメイン名 正規表現に一致していること
            if (!/^([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.){1,}[a-zA-Z]{2,}$/.test(targetState.siteDomain)) {
                result = false;
                changeState.siteDomainError = true;
            }
            // 指定されたドメインのみに限ること
            if (!/(ope\.azure\.ricoh-eim\.com)|(eim.ricoh.com)$/.test(targetState.siteDomain)) {
                result = false;
                changeState.siteDomainError = true;
            }
            this.setState(changeState);
            return result;
        };
        this.backPage = () => {
            this.props.navigation.pop();
            return true;
        };
        react_native_1.BackHandler.addEventListener('hardwareBackPress', this.backPage);
        const { cloneProp, diffState } = this.createState(props);
        this.state = Object.assign(cloneProp, diffState);
        delete this.state.accountListState;
    }
    createErrorMessages(state) {
        const hasError = state.siteDomainError || state.siteNameError;
        const siteErrorMessage = (this.state.siteDomainError) ? 'サイトドメインが正しくありません' : '';
        const siteNameErrorMessage = (this.state.siteNameError) ? 'サイト名称は必須です' : '';
        return { siteNameErrorMessage, siteErrorMessage, hasError };
    }
    async successConnect(tokens) {
        console.log('successConnect');
        native_base_1.Toast.show({ text: '認証に成功しました。', type: 'success' });
        // トークンを保存する
        const account = clone_1.default(this.state);
        account.eimToken = tokens;
        await AccountActions_1.asyncSaveAccountAction(account, this.props.dispatch);
        this.setState(account);
        this.setState({ mode: 'view' });
        // 遷移先を決定する
        await NavigateActions_1.default.navigateForLink(this.props.state.accountListState, {
            siteDomain: this.state.siteDomain,
            siteName: this.state.siteName,
            tokens,
        }, this.props.dispatch, this.props.navigation);
    }
    createState(props) {
        const cloneProp = clone_1.default(props.state);
        const diffState = {
            loginResultMessage: '',
            mode: 'view',
            shownEditMenu: false,
            shownLoginDialog: false,
            siteDomainError: true,
            siteNameError: true,
        };
        if (!cloneProp.id) {
            diffState.mode = 'edit';
        }
        return { cloneProp, diffState };
    }
}
_Account.navigationOptions = ({ navigation }) => {
    const { colorPalets } = config;
    return {
        headerRight: (react_1.default.createElement(native_base_1.Button, { transparent: true, onPress: navigation.getParam('remove'), style: navigation.getParam('removeButtonStyle') },
            react_1.default.createElement(native_base_1.Text, { style: { color: '#fff', fontSize: 16, marginTop: 10 } }, "\u524A\u9664"))),
        headerStyle: {
            backgroundColor: colorPalets.$colorPrimary3,
        },
        headerTintColor: colorPalets.$invertColor,
        headerTitle: 'サイト情報',
    };
};
exports._Account = _Account;
const mapStateToProps = (state) => {
    return {
        state: {
            ...state.account,
            accountListState: state.accountList
        },
    };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.__private__ = {
    mapStateToProps,
};
exports.default = react_redux_1.connect(mapStateToProps)(_Account);
