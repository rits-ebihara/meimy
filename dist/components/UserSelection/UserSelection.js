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
const UserBadge_1 = require("../UserBadge");
const UserSelectScreen_1 = __importDefault(require("./UserSelectScreen"));
const containerState = {
    flexDirection: 'row',
    flexWrap: 'wrap',
};
class UserSelection extends react_1.Component {
    constructor(props) {
        super(props);
        this.selectionModal = null;
        this.addButtonPress = () => {
            if (!!this.selectionModal) {
                this.selectionModal.show();
            }
            ;
        };
        this.createUserList = () => {
            return this.props.selectedUsers.map(user => {
                const badgeColor = user.badgeColor || this.props.badgeColor;
                const textColor = user.textColor || this.props.textColor;
                const defaultStyle = {
                    margin: 4,
                };
                const userBadgeStyle = Object.assign({}, defaultStyle, this.props.userBadgeStyle || {}, user.style || {});
                const props = {
                    badgeColor,
                    textColor,
                    style: userBadgeStyle,
                    userId: user.userId,
                    type: user.type,
                };
                return react_1.default.createElement(UserBadge_1.UserBadge, Object.assign({ key: props.userId }, props));
            });
        };
        this.state = {
            showDialog: false,
        };
    }
    render() {
        const { props } = this;
        const style = Object.assign({}, containerState, props.style);
        return (react_1.default.createElement(native_base_1.View, { style: style },
            this.createUserList(),
            react_1.default.createElement(native_base_1.Button, { transparent: true, icon: true, success: true, onPress: this.addButtonPress },
                react_1.default.createElement(native_base_1.Icon, { name: "md-add-circle" })),
            react_1.default.createElement(UserSelectScreen_1.default, { ref: (me) => this.selectionModal = me, filter: props.filter })));
    }
    ;
}
UserSelection.defaultProps = {
    addable: false,
    multiple: false,
};
exports.UserSelection = UserSelection;
exports.default = UserSelection;
