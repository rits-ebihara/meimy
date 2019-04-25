import Clone from 'clone';
import { Linking } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { Dispatch } from 'redux';
import UrlParse from 'url-parse';

import { EIMServiceAdapter } from '../../eim-service';
import config from '../Config';
import eimAccount from '../EimAccount';
import { IAuthAppQuery } from '../IEimAccount';
import RoutePageNames from '../RoutePageNames';
import { IAccountListState } from '../states/IAccountLisState';
import { createInitAccountState } from '../states/IAccountState';
import { IAuthState } from '../states/IAuthStates';
import { createSetAccountAction } from './AccountActions';
import { createSetAuthState } from './AccountListActions';
import { createSetAppListAction } from './EimAppListActions';
import INavigateController from './INavigateController';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class NavigateController implements INavigateController {
    public parentMainPage?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public parentNavParams?: { [key: string]: any };
    private linkStates: IAuthState = {
    };
    public navigateForLink = async (
        accountListState: IAccountListState,
        pLinkState: IAuthState,
        dispatch: Dispatch,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigation: NavigationScreenProp<any>,
        replace: boolean = false): Promise<boolean> => {
        const transferAccountPage = () => {
            const accountList = accountListState.accounts;
            let account = accountList.find((a) => a.siteDomain === this.linkStates.siteDomain);
            if (!account) {
                // なければアカウント新規作成画面に遷移する
                account = createInitAccountState();
                account.siteName = this.linkStates.siteDomain || '';
                account.siteDomain = this.linkStates.siteDomain || '';
            }
            dispatch(createSetAccountAction(account));
            if (replace) {
                navigation.replace(RoutePageNames.accountPageName);
            } else {
                navigation.navigate(RoutePageNames.accountPageName);
            }
        };

        this.linkStates = Object.assign({}, this.linkStates, pLinkState);
        if (!!this.linkStates.siteDomain && !!this.linkStates.appKey) {
            // ドメインとアプリが決まっている
            // トークンがある
            const sa = new EIMServiceAdapter(this.linkStates.siteDomain);
            const connected = await sa.validateToken(this.linkStates.tokens || []);
            // トークン検証
            if (!!connected) {
                // 成功
                // 呼び出しアプリを起動
                this.openApp({}, navigation);
                return true;
            } else {
                // 失敗
                // アカウント画面に遷移する
                transferAccountPage();
                return true;
            }
        } else {
            // サイトドメインが決まっている
            if (!!this.linkStates.siteDomain) {
                // トークンがある
                const sa = new EIMServiceAdapter(this.linkStates.siteDomain);
                // 接続済みの場合
                // トークンがある場合は、検証する
                const connected = await sa.validateToken(this.linkStates.tokens || []);
                // 検証の結果
                if (connected) {
                    // 認証が成功の場合
                    // アプリ一覧を取得
                    // アプリ一覧の画面に遷移する
                    if (this.linkStates.appKeyPrefix) {
                        dispatch(createSetAppListAction([]));
                        if (replace) {
                            navigation.replace(RoutePageNames.appListPageName);
                        } else {
                            navigation.navigate(RoutePageNames.appListPageName);
                        }
                    } else {
                        // アプリフレフィックスがなければサイト一覧画面に遷移する
                        if (replace) {
                            navigation.replace(RoutePageNames.accountListPageName);
                        } else {
                            navigation.navigate(RoutePageNames.accountListPageName);
                        }
                    }
                    return true;
                } else {
                    // 失敗の場合、アカウントの画面に遷移する
                    transferAccountPage();
                }
                return true;
            } else {
                // ドメインの指定がない場合は、なにもしない
                return false;
            }
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
    public openAccountManager = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigation: NavigationScreenProp<any>,
        dispatch: Dispatch,
        link?: string,
        hash?: string) => {
        const authState: IAuthState = {
            appKeyPrefix: config.appKeyPrefix,
        };
        const accountManagerUrl = UrlParse('eimapplink-accountmanager://accountmanager/');
        const query: IAuthAppQuery = {
            appprefix: config.appKeyPrefix,
            mapp: config.mobileAppKey,
        };
        const open = (_appKey?: string, _domain?: string) => {
            if (!!_appKey && !!_domain) {
                query.appkey = _appKey;
                query.domain = _domain;
                authState.appKey = _appKey;
                authState.siteDomain = _domain;
            }
            if (!!link) {
                const linkUrl = UrlParse(link);
                linkUrl.set('hash', hash);
                query.link = linkUrl.href;
                authState.link = linkUrl.href;
            }
            accountManagerUrl.set('query', query);
            Linking.canOpenURL(accountManagerUrl.href).then((result) => {
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
        };
        let appKey: string | undefined;
        let domain: string | undefined;
        // メールなど文書を開くリンクから開く
        if (!!link && !!hash) {
            const linkUrl = UrlParse(link);
            domain = linkUrl.host;
            const paths = hash.split('/');
            appKey = paths.length === 5 ? paths[2] : undefined;
            open(appKey, domain);
            return;
        }
        // 前回アクセスしたサイトを取得する
        eimAccount.load().then((lastAccount) => {
            // 認証アプリを起動する
            if (!!lastAccount) {
                open(lastAccount.appKey, lastAccount.domain);
            } else {
                open();
            }
        });
    }
}
export default new NavigateController();
