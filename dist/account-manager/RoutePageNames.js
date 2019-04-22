"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_navigation_1 = require("react-navigation");
const Account_1 = __importDefault(require("./views/containers/Account"));
const AccountList_1 = __importDefault(require("./views/containers/AccountList"));
const EimAppList_1 = __importDefault(require("./views/containers/EimAppList"));
const WebSignIn_1 = __importDefault(require("./views/containers/WebSignIn"));
exports.routePageNames = {
    accountListPageName: 'accountList',
    accountPageName: 'accountPage',
    appListPageName: 'appListPage',
    authPageName: 'auth',
    webSignInPageName: 'webSignInPage',
};
const authRouteConfigMap = {};
authRouteConfigMap[exports.routePageNames.accountListPageName] = AccountList_1.default;
authRouteConfigMap[exports.routePageNames.accountPageName] = Account_1.default;
authRouteConfigMap[exports.routePageNames.appListPageName] = EimAppList_1.default;
authRouteConfigMap[exports.routePageNames.webSignInPageName] = WebSignIn_1.default;
exports.authStackNav = react_navigation_1.createStackNavigator(authRouteConfigMap, {
    initialRouteName: exports.routePageNames.accountListPageName,
});
exports.default = exports.routePageNames;
