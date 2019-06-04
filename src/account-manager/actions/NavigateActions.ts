import Clone from 'clone';
import { Linking } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Dispatch } from 'redux';
import UrlParse from 'url-parse';

import { EIMServiceAdapter } from '../../eim-service/EIMServiceAdapter';
import { getConfig } from '../Config';
import { getEimAccount } from '../EimAccount';
import { IAuthAppQuery } from '../IEimAccount';
import RoutePageNames from '../RoutePageNames';
import { IAccountListState } from '../states/IAccountLisState';
import { createInitAccountState } from '../states/IAccountState';
import { IAuthState } from '../states/IAuthStates';
import { createSetAccountAction } from './AccountActions';
import { createSetAuthState } from './AccountListActions';
import { createSetAppListAction } from './EimAppListActions';
import INavigateController from './INavigateController';

export class NavigateController implements INavigateController {
    public parentMainPage?: string;
    public parentNavParams?: { [key: string]: any };
    private linkStates: IAuthState = {};
    private transferAccountPage = (
        accountListState: IAccountListState,
        dispatch: Dispatch,
        navigation: NavigationScreenProp<any>,
        replace: boolean = false,
        siteDomain: string,
    ) => {
        const accountList = accountListState.accounts;
        let account = accountList.find((a) => a.siteDomain === this.linkStates.siteDomain);
        if (!account) {
            // なければアカウント新規作成画面に遷移する
            account = createInitAccountState();
            const name = siteDomain;
            account.siteName = name;
            account.siteDomain = name;
        }
        dispatch(createSetAccountAction(account));
        if (replace) {
            navigation.replace(RoutePageNames.accountPageName);
        } else {
            navigation.navigate(RoutePageNames.accountPageName);
        }
    };
    private determinedAppAndDomain = async (
        siteDomain: string,
        navigation: NavigationScreenProp<any>,
        accountListState: IAccountListState,
        dispatch: Dispatch,
        replace: boolean = false
    ): Promise<boolean> => {
        // トークンがある
        const sa = new EIMServiceAdapter(siteDomain);
        const connected = await sa.validateToken(this.linkStates.tokens || []);
        // トークン検証
        if (!!connected) {
            // 成功
            // 呼び出しアプリを起動
            await this.openApp({}, navigation);
            return true;
        } else {
            // 失敗
            // アカウント画面に遷移する
            this.transferAccountPage(
                accountListState, dispatch, navigation, replace, siteDomain);
            return true;
        }
    }
    private deteminedAppOnly = async (
        domain: string,
        replace: boolean,
        navigation: NavigationScreenProp<any>,
        dispatch: Dispatch,
        accountListState: IAccountListState,
    ) => {
        const sa = new EIMServiceAdapter(domain);
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
                dispatch(createSetAppListAction([]));
                moveTo(RoutePageNames.appListPageName);
            } else {
                moveTo(RoutePageNames.accountListPageName);
            }
            return true;
        } else {
            // 失敗の場合、アカウントの画面に遷移する
            this.transferAccountPage(
                accountListState, dispatch, navigation, replace, domain);
        }
        return true;
    }
    public navigateForLink = async (
        accountListState: IAccountListState,
        pLinkState: IAuthState,
        dispatch: Dispatch,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigation: NavigationScreenProp<any>,
        replace: boolean = false
    ): Promise<boolean> => {
        this.linkStates = Object.assign({}, this.linkStates, pLinkState);
        if (!!this.linkStates.siteDomain && !!this.linkStates.appKey) {
            // ドメインとアプリが決まっている
            return await this.determinedAppAndDomain(
                this.linkStates.siteDomain,
                navigation,
                accountListState,
                dispatch,
                replace);
        } else if (!!this.linkStates.siteDomain) {
            // サイトドメインが決まっている
            // トークンがある
            return await this.deteminedAppOnly(
                this.linkStates.siteDomain,
                replace,
                navigation,
                dispatch,
                accountListState,
            );
        } else {
            // ドメインの指定がない場合は、なにもしない
            return false;
        }
    }
    public clear = () => {
        this.linkStates = {};
    }
    public getLinkState = () => {
        return Clone(this.linkStates);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public openApp = async (pLinkState: IAuthState, navigation: NavigationScreenProp<any>) => {
        this.linkStates = Object.assign({}, this.linkStates, pLinkState);
        const eimAccount = getEimAccount();
        eimAccount.appKey = this.linkStates.appKey || '';
        eimAccount.domain = this.linkStates.siteDomain || '';
        eimAccount.siteName = this.linkStates.siteName || '';
        eimAccount.eimTokens = this.linkStates.tokens || [];
        await eimAccount.save();
        await eimAccount.loadUser();
        if (this.parentMainPage) {
            navigation.navigate(this.parentMainPage, this.parentNavParams);
        }
    }
    public openAccountManager = async (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigation: NavigationScreenProp<any>,
        dispatch: Dispatch,
        link?: string,
        hash?: string
    ) => {
        let appKey: string | undefined;
        let domain: string | undefined;
        // 部分適用
        const open = (appKey?: string, domain?: string) => {
            return this._openAccountManager(
                dispatch, navigation, link, hash,
                appKey, domain);
        }
        // メールなど文書を開くリンクから開く
        if (!!link && !!hash) {
            const linkUrl = UrlParse(link);
            domain = linkUrl.host;
            const paths = hash.split('/');
            appKey = paths.length === 5 ? paths[2] : undefined;
            open(appKey, domain);
            return;
        }
        const eimAccount = getEimAccount();
        // 前回アクセスしたサイトを取得する
        await eimAccount.load().then((lastAccount) => {
            // 認証アプリを起動する
            if (!!lastAccount) {
                open(lastAccount.appKey, lastAccount.domain);
            } else {
                open();
            }
        });
    }
    private _openAccountManager = async (
        dispatch: Dispatch, navigation: NavigationScreenProp<any>,
        link?: string, hash?: string,
        appKey?: string, domain?: string
    ) => {
        const config = getConfig();

        const authState: IAuthState = {
            appKeyPrefix: config.appKeyPrefix,
        };
        const accountManagerUrl = UrlParse('eimapplink-accountmanager://accountmanager/');
        const query: IAuthAppQuery = {
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
            const linkUrl = UrlParse(link);
            linkUrl.set('hash', hash);
            query.link = linkUrl.href;
            authState.link = linkUrl.href;
        }

        accountManagerUrl.set('query', query);
        await Linking.canOpenURL(accountManagerUrl.href).then((result) => {
            if (result) {
                Linking.openURL(accountManagerUrl.href);
            } else {
                this.parentMainPage = config.startPage;
                if (!!hash) {
                    const paths = hash.split('/');
                    this.parentNavParams = {
                        parameter: paths.length === 5 ? paths[4] : undefined,
                    };
                }
                dispatch(createSetAuthState(authState));
                navigation.navigate(RoutePageNames.authPageName);
            }
        });
    }
}
export default new NavigateController();
