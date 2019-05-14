import { createStackNavigator, NavigationRouteConfigMap } from 'react-navigation';

import routePageNames from './RoutePageNames';
import Account from './views/containers/Account';
import AccountList from './views/containers/AccountList';
import EimAppList from './views/containers/EimAppList';
import WebSignIn from './views/containers/WebSignIn';

const authRouteConfigMap: NavigationRouteConfigMap = {};
authRouteConfigMap[routePageNames.accountListPageName] = AccountList;
authRouteConfigMap[routePageNames.accountPageName] = Account;
authRouteConfigMap[routePageNames.appListPageName] = EimAppList;
authRouteConfigMap[routePageNames.webSignInPageName] = WebSignIn;

export const authStackNav = createStackNavigator(authRouteConfigMap, {
    initialRouteName: routePageNames.accountListPageName,
});
