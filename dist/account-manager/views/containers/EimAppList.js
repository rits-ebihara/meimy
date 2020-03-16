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
const react_redux_1 = require("react-redux");
const EimAppListActions_1 = require("../../actions/EimAppListActions");
const NavigateActions_1 = __importDefault(require("../../actions/NavigateActions"));
const Config_1 = require("../../Config");
const LangProfile_1 = require("../../../LangProfile");
const config = Config_1.getConfig();
class EimAppList extends react_1.Component {
    constructor(props) {
        super(props);
        this.render = () => {
            const appListBox = this.props.state.appList.map((app) => {
                return (react_1.default.createElement(native_base_1.ListItem, { noIndent: true, key: app.appKey, onPress: this.onPressItem.bind(this, app.appKey) },
                    react_1.default.createElement(native_base_1.Body, null,
                        react_1.default.createElement(native_base_1.Text, null, app.appName),
                        react_1.default.createElement(native_base_1.Text, { note: true }, app.description))));
            });
            return (react_1.default.createElement(native_base_1.Container, null, this.props.state.loading ? react_1.default.createElement(native_base_1.Spinner, { color: "blue" }) : appListBox));
        };
        this.componentDidMount = () => {
            EimAppListActions_1.createLoadAppListAction(this.props.dispatch, NavigateActions_1.default, this.props.navigation, this.onNetworkError);
        };
        this.onPressItem = (appKey) => {
            NavigateActions_1.default.openApp({ appKey }, this.props.navigation);
        };
        this.onNetworkError = () => {
            native_base_1.Toast.show({
                text: LangProfile_1.langProfile.replaceLang('LK_MSG_networkError'),
                type: 'warning',
            });
            this.props.dispatch(EimAppListActions_1.createSetAppListAction([]));
        };
        this.onPressBackButton = () => {
            this.props.navigation.pop();
            return true;
        };
        react_native_1.BackHandler.addEventListener('hardwareBackPress', this.onPressBackButton);
    }
}
EimAppList.navigationOptions = () => {
    return {
        headerStyle: {
            backgroundColor: config.colorPalets.$colorPrimary3,
        },
        headerTintColor: config.colorPalets.$invertColor,
        headerTitle: LangProfile_1.langProfile.replaceLang('LK_appList'),
    };
};
const mapStateToProps = (state) => {
    return {
        state: state.appList,
    };
};
exports.__private__ = {
    EimAppList: EimAppList,
    mapStateToProps,
};
exports.default = react_redux_1.connect(mapStateToProps)(EimAppList);
