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
const react_redux_1 = require("react-redux");
const FloatingButton_1 = require("../../../components/FloatingButton/FloatingButton");
const AccountActions_1 = require("../../actions/AccountActions");
const AccountListActions_1 = require("../../actions/AccountListActions");
const NavigateActions_1 = __importDefault(require("../../actions/NavigateActions"));
const Config_1 = require("../../Config");
const RoutePageNames_1 = __importDefault(require("../../RoutePageNames"));
const IAccountState_1 = require("../../states/IAccountState");
const config = Config_1.getConfig();
class AccountList extends react_1.Component {
    constructor() {
        super(...arguments);
        this.render = () => {
            // console.log(this.props.state.accounts);
            const { state } = this.props;
            const { theme } = config;
            const listItems = state.accounts.map((account) => {
                if (!account.id) {
                    return null;
                }
                return (react_1.default.createElement(native_base_1.ListItem, { noIndent: true, key: account.id, button: true, onPress: () => { this.onPressListItem(account); } },
                    react_1.default.createElement(native_base_1.Body, null,
                        react_1.default.createElement(native_base_1.Text, null, account.siteName),
                        react_1.default.createElement(native_base_1.Text, { note: true }, account.siteDomain)),
                    react_1.default.createElement(native_base_1.Right, null,
                        react_1.default.createElement(native_base_1.Icon, { name: "arrow-forward" }))));
            });
            return (react_1.default.createElement(native_base_1.Container, null,
                react_1.default.createElement(native_base_1.Content, null,
                    react_1.default.createElement(native_base_1.List, null, listItems)),
                react_1.default.createElement(FloatingButton_1.FloatingButton, { primaryButtonColor: theme.btnPrimaryBg, onPress: this.onPressAddButton })));
        };
        this.componentDidMount = () => {
            AccountListActions_1.asyncLoadAccountListAfterShow(this.props.dispatch).then(() => {
                this.transferPage(this.props.state.authState);
            });
        };
        this.onPressListItem = (account) => {
            this.props.dispatch(AccountActions_1.createSetAccountAction(account));
            this.props.navigation.push(RoutePageNames_1.default.accountPageName);
        };
        this.onPressAddButton = () => {
            this.props.dispatch(AccountActions_1.createSetAccountAction(IAccountState_1.createInitAccountState()));
            this.props.navigation.push(RoutePageNames_1.default.accountPageName);
        };
    }
    transferPage(authState) {
        // ドメインが指定された場合、トークンがあればそれをセットする
        const account = this.props.state.accounts
            .find((a) => a.siteDomain === authState.siteDomain);
        if (!!account) {
            authState.tokens = account.eimToken;
            authState.siteName = account.siteName;
        }
        // this.props.navigation.navigate(accountListPageName);
        NavigateActions_1.default.clear();
        NavigateActions_1.default.navigateForLink(this.props.state, authState, this.props.dispatch, this.props.navigation);
    }
}
AccountList.navigationOptions = () => {
    return {
        headerStyle: {
            backgroundColor: config.colorPalets.$colorPrimary3,
        },
        headerTintColor: config.colorPalets.$invertColor,
        headerTitle: 'EIMサイト一覧',
    };
};
const mapStateToProps = (state) => {
    return {
        state: state.accountList,
    };
};
exports.default = react_redux_1.connect(mapStateToProps)(AccountList);
// eslint-disable-next-line max-len
// adb shell am start -a android.intent.action.VIEW "eimmobile://accountmanager/?app=decision-flow\&domain=app-dev43.ope.azure.ricoh-eim.com"
// eslint-disable-next-line max-len
// adb shell am start -a android.intent.action.VIEW "eimapplink-accountmanager://accountmanager/?mapp=decision-flow\&domain=app-dev54.ope.azure.ricoh-eim.com\&appprefix=DWS\&link=https%3A%2F%2Frits3.eim.ricoh.com%2F%23%2Fapps%2FdocManagementApp%2Fdocuments%2F9dd4435823554142a069ce9ee81b1e12"
