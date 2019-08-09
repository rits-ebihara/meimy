"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const react_native_1 = require("react-native");
const url_parse_1 = __importDefault(require("url-parse"));
const EIMServiceAdapter_1 = require("../../eim-service/EIMServiceAdapter");
const Config_1 = require("../Config");
const EimAccount_1 = require("../EimAccount");
const RoutePageNames_1 = __importDefault(require("../RoutePageNames"));
const IAccountState_1 = require("../states/IAccountState");
const AccountActions_1 = require("./AccountActions");
const AccountListActions_1 = require("./AccountListActions");
const EimAppListActions_1 = require("./EimAppListActions");
class NavigateController {
    constructor() {
        this.linkStates = {};
        this.transferAccountPage = (accountListState, dispatch, navigation, replace, siteDomain) => {
            const accountList = accountListState.accounts;
            let account = accountList.find((a) => a.siteDomain === this.linkStates.siteDomain);
            if (!account) {
                // なければアカウント新規作成画面に遷移する
                account = IAccountState_1.createInitAccountState();
                const name = siteDomain;
                account.siteName = name;
                account.siteDomain = name;
            }
            dispatch(AccountActions_1.createSetAccountAction(account));
            if (replace) {
                navigation.replace(RoutePageNames_1.default.accountPageName);
            }
            else {
                navigation.navigate(RoutePageNames_1.default.accountPageName);
            }
        };
        this.determinedAppAndDomain = async (siteDomain, navigation, accountListState, dispatch, replace) => {
            // トークンがある
            const sa = new EIMServiceAdapter_1.EIMServiceAdapter(siteDomain);
            const connected = await sa.validateToken(this.linkStates.tokens || []);
            // トークン検証
            if (!!connected) {
                // 成功
                // 呼び出しアプリを起動
                await this.openApp({}, navigation);
                return true;
            }
            else {
                // 失敗
                // アカウント画面に遷移する
                this.transferAccountPage(accountListState, dispatch, navigation, replace, siteDomain);
                return true;
            }
        };
        this.deteminedAppOnly = async (domain, replace, navigation, dispatch, accountListState) => {
            const sa = new EIMServiceAdapter_1.EIMServiceAdapter(domain);
            // 接続済みの場合
            // トークンがある場合は、検証する
            const connected = await sa.validateToken(this.linkStates.tokens || []);
            // 検証の結果
            if (connected) {
                // 認証が成功の場合
                // アプリ一覧を取得
                // アプリ一覧の画面に遷移する
                const moveTo = (replace) ? navigation.replace : navigation.navigate;
                if (this.linkStates.appKeyPrefix) {
                    dispatch(EimAppListActions_1.createSetAppListAction([]));
                    moveTo(RoutePageNames_1.default.appListPageName);
                }
                else {
                    moveTo(RoutePageNames_1.default.accountListPageName);
                }
                return true;
            }
            else {
                // 失敗の場合、アカウントの画面に遷移する
                this.transferAccountPage(accountListState, dispatch, navigation, replace, domain);
            }
            return true;
        };
        this.navigateForLink = async (accountListState, pLinkState, dispatch, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigation, replace = false) => {
            this.linkStates = Object.assign({}, this.linkStates, pLinkState);
            if (!!this.linkStates.siteDomain && !!this.linkStates.appKey) {
                // ドメインとアプリが決まっている
                return await this.determinedAppAndDomain(this.linkStates.siteDomain, navigation, accountListState, dispatch, replace);
            }
            else if (!!this.linkStates.siteDomain) {
                // サイトドメインが決まっている
                // トークンがある
                return await this.deteminedAppOnly(this.linkStates.siteDomain, replace, navigation, dispatch, accountListState);
            }
            else {
                // ドメインの指定がない場合は、なにもしない
                return false;
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
            const eimAccount = EimAccount_1.getEimAccount();
            eimAccount.clear();
            eimAccount.appKey = this.linkStates.appKey || '';
            eimAccount.domain = this.linkStates.siteDomain || '';
            eimAccount.siteName = this.linkStates.siteName || '';
            eimAccount.eimTokens = this.linkStates.tokens || [];
            await eimAccount.save();
            await eimAccount.loadUser();
            if (this.parentMainPage) {
                navigation.navigate(this.parentMainPage, this.parentNavParams);
            }
        };
        this.openAccountManager = async (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigation, dispatch, link, hash) => {
            let appKey;
            let domain;
            // 部分適用
            const open = (appKey, domain) => {
                return this._openAccountManager(dispatch, navigation, link, hash, appKey, domain);
            };
            // メールなど文書を開くリンクから開く
            if (!!link && !!hash) {
                const linkUrl = url_parse_1.default(link);
                domain = linkUrl.host;
                const paths = hash.split('/');
                appKey = paths.length === 5 ? paths[2] : undefined;
                open(appKey, domain);
                return;
            }
            const eimAccount = EimAccount_1.getEimAccount();
            // 前回アクセスしたサイトを取得する
            await eimAccount.load().then((lastAccount) => {
                // 認証アプリを起動する
                if (!!lastAccount) {
                    open(lastAccount.appKey, lastAccount.domain);
                }
                else {
                    open();
                }
            });
        };
        this._openAccountManager = async (dispatch, navigation, link, hash, appKey, domain) => {
            const config = Config_1.getConfig();
            const authState = {
                appKeyPrefix: config.appKeyPrefix,
            };
            const accountManagerUrl = url_parse_1.default('eimapplink-accountmanager://accountmanager/');
            const query = {
                appprefix: config.appKeyPrefix,
                mapp: config.appKeyPrefix,
            };
            if (!!appKey && !!domain) {
                query.appkey = appKey;
                query.domain = domain;
                authState.appKey = appKey;
                authState.siteDomain = domain;
            }
            if (!!link) {
                const linkUrl = url_parse_1.default(link);
                linkUrl.set('hash', hash);
                query.link = linkUrl.href;
                authState.link = linkUrl.href;
            }
            accountManagerUrl.set('query', query);
            await react_native_1.Linking.canOpenURL(accountManagerUrl.href).then((result) => {
                if (result) {
                    react_native_1.Linking.openURL(accountManagerUrl.href);
                }
                else {
                    this.parentMainPage = config.startPage;
                    if (!!hash) {
                        const paths = hash.split('/');
                        this.parentNavParams = {
                            parameter: paths.length === 5 ? paths[4] : undefined,
                        };
                    }
                    dispatch(AccountListActions_1.createSetAuthState(authState));
                    navigation.navigate(RoutePageNames_1.default.authPageName);
                }
            });
        };
    }
}
exports.NavigateController = NavigateController;
exports.default = new NavigateController();
