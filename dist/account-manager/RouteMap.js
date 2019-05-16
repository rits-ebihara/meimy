"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_navigation_1 = require("react-navigation");
const RoutePageNames_1 = __importDefault(require("./RoutePageNames"));
const Account_1 = __importDefault(require("./views/containers/Account"));
const AccountList_1 = __importDefault(require("./views/containers/AccountList"));
const EimAppList_1 = __importDefault(require("./views/containers/EimAppList"));
const WebSignIn_1 = __importDefault(require("./views/containers/WebSignIn"));
const authRouteConfigMap = {};
authRouteConfigMap[RoutePageNames_1.default.accountListPageName] = AccountList_1.default;
authRouteConfigMap[RoutePageNames_1.default.accountPageName] = Account_1.default;
authRouteConfigMap[RoutePageNames_1.default.appListPageName] = EimAppList_1.default;
authRouteConfigMap[RoutePageNames_1.default.webSignInPageName] = WebSignIn_1.default;
exports.authStackNav = react_navigation_1.createStackNavigator(authRouteConfigMap, {
    initialRouteName: RoutePageNames_1.default.accountListPageName,
});
