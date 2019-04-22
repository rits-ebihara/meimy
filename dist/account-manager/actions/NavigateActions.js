"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const react_native_1 = require("react-native");
const url_parse_1 = __importDefault(require("url-parse"));
const eim_service_1 = require("../../eim-service");
const Config_1 = __importDefault(require("../Config"));
const EimAccount_1 = __importDefault(require("../EimAccount"));
const RoutePageNames_1 = __importDefault(require("../RoutePageNames"));
const IAccountState_1 = require("../states/IAccountState");
const AccountActions_1 = require("./AccountActions");
const AccountListActions_1 = require("./AccountListActions");
const EimAppListActions_1 = require("./EimAppListActions");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class NavigateController {
    constructor() {
        this.linkStates = {};
        this.navigateForLink = async (accountListState, pLinkState, dispatch, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigation, replace = false) => {
            const transferAccountPage = () => {
                const accountList = accountListState.accounts;
                let account = accountList.find((a) => a.siteDomain === this.linkStates.siteDomain);
                if (!account) {
                    // なければアカウント新規作成画面に遷移する
                    account = IAccountState_1.createInitAccountState();
                    account.siteName = this.linkStates.siteDomain || '';
                    account.siteDomain = this.linkStates.siteDomain || '';
                }
                dispatch(AccountActions_1.createSetAccountAction(account));
                if (replace) {
                    navigation.replace(RoutePageNames_1.default.accountPageName);
                }
                else {
                    navigation.navigate(RoutePageNames_1.default.accountPageName);
                }
            };
            this.linkStates = Object.assign({}, this.linkStates, pLinkState);
            if (!!this.linkStates.siteDomain && !!this.linkStates.appKey) {
                // ドメインとアプリが決まっている
                // トークンがある
                const sa = new eim_service_1.EIMServiceAdapter(this.linkStates.siteDomain);
                const connected = await sa.validateToken(this.linkStates.tokens || []);
                // トークン検証
                if (!!connected) {
                    // 成功
                    // 呼び出しアプリを起動
                    this.openApp({}, navigation);
                    return true;
                }
                else {
                    // 失敗
                    // アカウント画面に遷移する
                    transferAccountPage();
                    return true;
                }
            }
            else {
                // サイトドメインが決まっている
                if (!!this.linkStates.siteDomain) {
                    // トークンがある
                    const sa = new eim_service_1.EIMServiceAdapter(this.linkStates.siteDomain);
                    // 接続済みの場合
                    // トークンがある場合は、検証する
                    const connected = await sa.validateToken(this.linkStates.tokens || []);
                    // 検証の結果
                    if (connected) {
                        // 認証が成功の場合
                        // アプリ一覧を取得
                        // アプリ一覧の画面に遷移する
                        if (this.linkStates.appKeyPrefix) {
                            dispatch(EimAppListActions_1.createSetAppListAction([]));
                            if (replace) {
                                navigation.replace(RoutePageNames_1.default.appListPageName);
                            }
                            else {
                                navigation.navigate(RoutePageNames_1.default.appListPageName);
                            }
                        }
                        else {
                            // アプリフレフィックスがなければサイト一覧画面に遷移する
                            if (replace) {
                                navigation.replace(RoutePageNames_1.default.accountListPageName);
                            }
                            else {
                                navigation.navigate(RoutePageNames_1.default.accountListPageName);
                            }
                        }
                        return true;
                    }
                    else {
                        // 失敗の場合、アカウントの画面に遷移する
                        transferAccountPage();
                    }
                    return true;
                }
                else {
                    // ドメインの指定がない場合は、なにもしない
                    return false;
                }
            }
        };
        this.clear = () => {
            this.linkStates = {};
        };
        this.getLinkState = () => {
            return clone_1.default(this.linkStates);
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.openApp = async (pLinkState, navigation) => {
            this.linkStates = Object.assign({}, this.linkStates, pLinkState);
            EimAccount_1.default.appKey = this.linkStates.appKey || '';
            EimAccount_1.default.domain = this.linkStates.siteDomain || '';
            EimAccount_1.default.siteName = this.linkStates.siteName || '';
            EimAccount_1.default.eimTokens = this.linkStates.tokens || [];
            await EimAccount_1.default.save();
            await EimAccount_1.default.loadUser();
            if (this.parentMainPage) {
                navigation.navigate(this.parentMainPage, this.parentNavParams);
            }
        };
        this.openAccountManager = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigation, dispatch, link, hash) => {
            const authState = {
                appKeyPrefix: Config_1.default.appKeyPrefix,
            };
            const accountManagerUrl = url_parse_1.default('eimapplink-accountmanager://accountmanager/');
            const query = {
                appprefix: Config_1.default.appKeyPrefix,
                mapp: Config_1.default.mobileAppKey,
            };
            const open = (_appKey, _domain) => {
                if (!!_appKey && !!_domain) {
                    query.appkey = _appKey;
                    query.domain = _domain;
                    authState.appKey = _appKey;
                    authState.siteDomain = _domain;
                }
                if (!!link) {
                    const linkUrl = url_parse_1.default(link);
                    linkUrl.set('hash', hash);
                    query.link = linkUrl.href;
                    authState.link = linkUrl.href;
                }
                accountManagerUrl.set('query', query);
                react_native_1.Linking.canOpenURL(accountManagerUrl.href).then((result) => {
                    if (result) {
                        react_native_1.Linking.openURL(accountManagerUrl.href);
                    }
                    else {
                        this.parentMainPage = Config_1.default.startPage;
                        if (!!hash) {
                            const paths = hash.split('/');
                            this.parentNavParams = {
                                docId: paths.length === 5 ? paths[4] : undefined,
                            };
                        }
                        dispatch(AccountListActions_1.createSetAuthState(authState));
                        navigation.navigate(RoutePageNames_1.default.authPageName);
                    }
                });
            };
            let appKey;
            let domain;
            // メールなど文書を開くリンクから開く
            if (!!link && !!hash) {
                const linkUrl = url_parse_1.default(link);
                domain = linkUrl.host;
                const paths = hash.split('/');
                appKey = paths.length === 5 ? paths[2] : undefined;
                open(appKey, domain);
                return;
            }
            // 前回アクセスしたサイトを取得する
            EimAccount_1.default.load().then((lastAccount) => {
                // 認証アプリを起動する
                if (!!lastAccount) {
                    open(lastAccount.appKey, lastAccount.domain);
                }
                else {
                    open();
                }
            });
        };
    }
}
exports.default = new NavigateController();