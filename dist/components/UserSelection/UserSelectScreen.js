"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const directoryTypeKeys = [
    'user',
    'group',
    'organization',
];
const directoryType = {
    user: 'ユーザー',
    group: 'グループ',
    organization: '組織',
};
const containerStyle = {
    backgroundColor: '#fff',
    width: '95%',
    height: '95%',
};
const searchBox = {
    flexDirection: 'row',
};
class UserSelectScreen extends react_1.Component {
    constructor(props) {
        super(props);
        this.show = () => {
            this.setState({
                shown: true,
            });
        };
        this.closeButtonPress = () => {
            this.setState({
                shown: false,
            });
        };
        this.changeSearchWords = (value) => {
            this.setState({
                searchWords: value,
            });
        };
        this.createSearchedUserList = () => {
            return this.state.searchResult.map(item => (react_1.default.createElement(native_base_1.ListItem, { key: item.id },
                react_1.default.createElement(native_base_1.Body, null,
                    react_1.default.createElement(native_base_1.Text, null, item.displayName),
                    react_1.default.createElement(native_base_1.Text, null, item.orgName)),
                react_1.default.createElement(native_base_1.Right, null,
                    react_1.default.createElement(native_base_1.Button, { icon: true, transparent: true, success: true },
                        react_1.default.createElement(native_base_1.Icon, { name: "add-circle" }))))));
        };
        this.createDirectoryTypePicker = (selectedDirectoryType) => {
            const items = directoryTypeKeys.map(key => (react_1.default.createElement(react_native_1.Picker.Item, { key: key, label: directoryType[key], value: key })));
            return (react_1.default.createElement(react_native_1.Picker, { mode: "dropdown", selectedValue: selectedDirectoryType, onValueChange: this.changeDirectoryType.bind(this) }, items));
        };
        this.changeDirectoryType = (key) => {
            this.setState({
                selectedDirectoryType: key,
            });
        };
        this.state = {
            searchResult: [],
            selectedDirectoryType: 'user',
            openFilterSetting: false,
            searchWords: '',
            searchCondition: {
                limit: 30,
                offset: 0,
            },
            shown: false,
        };
    }
    render() {
        return (react_1.default.createElement(react_native_1.Modal, { transparent: true, animated: true, animationType: "fade", visible: this.state.shown },
            react_1.default.createElement(native_base_1.View, { style: {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
                react_1.default.createElement(native_base_1.View, { style: containerStyle },
                    react_1.default.createElement(native_base_1.View, { style: { flexDirection: 'row-reverse' } },
                        react_1.default.createElement(native_base_1.Button, { icon: true, transparent: true, onPress: this.closeButtonPress },
                            react_1.default.createElement(native_base_1.Icon, { name: "close" }))),
                    react_1.default.createElement(native_base_1.View, null,
                        react_1.default.createElement(native_base_1.Form, { style: searchBox },
                            react_1.default.createElement(native_base_1.Item, { fixedLabel: true, style: { flexGrow: 1 } },
                                react_1.default.createElement(native_base_1.Input, { value: this.state.searchWords, placeholder: "\u691C\u7D22", onChangeText: this.changeSearchWords, returnKeyType: "search" })),
                            react_1.default.createElement(native_base_1.Button, { icon: true, transparent: true, style: { flexGrow: 0 } },
                                react_1.default.createElement(native_base_1.Icon, { name: "search" })),
                            react_1.default.createElement(native_base_1.View, { style: { flexGrow: 1 } }, this.createDirectoryTypePicker(this.state.selectedDirectoryType))),
                        react_1.default.createElement(native_base_1.List, null, this.createSearchedUserList()))))));
    }
}
UserSelectScreen.defaultProps = {
    filter: {
        users: true,
        groups: true,
        organizations: true,
    }
};
exports.UserSelectScreen = UserSelectScreen;
exports.default = UserSelectScreen;
