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
        this.addList = (userDocId, type) => {
            const existUser = this.props.selectedUsers.find(u => u.userDocId === userDocId);
            if (existUser) {
                return;
            }
            const userList = [...this.props.selectedUsers, {
                    type,
                    userDocId,
                }];
            // すでに有れば無視
            this.onChange(userList);
        };
        this.onChange = (userList) => {
            this.props.onChange(userList);
        };
        this.addButtonPress = () => {
            if (!!this.selectionModal) {
                this.selectionModal.show();
            }
            ;
        };
        this.createUserList = () => {
            return this.props.selectedUsers.map(user => {
                const defaultStyle = {
                    margin: 4,
                };
                const userProps = this.props.userBadgeProp;
                if (!!userProps.style) {
                    userProps.style = Object.assign({}, defaultStyle, userProps.style);
                }
                else {
                    userProps.style = defaultStyle;
                }
                const props = {
                    ...userProps,
                    userId: user.userDocId,
                    onLongPress: this.onDelete,
                };
                return react_1.default.createElement(UserBadge_1.UserBadge, Object.assign({ key: props.userId }, props));
            });
        };
        this.onDelete = (userDocId) => {
            const { selectedUsers } = this.props;
            const index = selectedUsers.findIndex(a => a.userDocId === userDocId);
            if (index === -1) {
                return;
            }
            selectedUsers.splice(index, 1);
            this.onChange([...selectedUsers]);
        };
    }
    render() {
        const { props } = this;
        const style = Object.assign({}, containerState, props.style);
        return (react_1.default.createElement(native_base_1.View, { style: style },
            this.createUserList(),
            this.props.showAddButton ?
                react_1.default.createElement(native_base_1.Button, { transparent: true, icon: true, success: true, key: "add-button", onPress: this.addButtonPress },
                    react_1.default.createElement(native_base_1.Icon, { name: "md-add-circle" })) : null,
            react_1.default.createElement(UserSelectScreen_1.default, { key: "user-select-screen", ref: (me) => this.selectionModal = me, filter: props.filter, onSelect: this.addList })));
    }
    ;
}
UserSelection.defaultProps = {
    addable: false,
    multiple: false,
    userBadgeProp: {},
};
exports.UserSelection = UserSelection;
exports.default = UserSelection;
