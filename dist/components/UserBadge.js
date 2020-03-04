"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const native_base_1 = require("native-base");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const url_parse_1 = __importDefault(require("url-parse"));
const EimAccount_1 = require("../account-manager/EimAccount");
const group_png_1 = __importDefault(require("../resources/group.png"));
const ms_teams_png_1 = __importDefault(require("../resources/ms-teams.png"));
const user_png_1 = __importDefault(require("../resources/user.png"));
const LangProfile_1 = require("../LangProfile");
const shareIconStyle = {
    height: 24,
    width: 24,
};
class UserBadge extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.$isMounted = false;
        this.componentDidMount = () => {
            this.$isMounted = true;
            (async () => {
                if (!this.$isMounted || !this.props.userId) {
                    return;
                }
                let result;
                const eimAccount = EimAccount_1.getEimAccount();
                result = await eimAccount.getServiceAdapter().getUserDocById(eimAccount.eimTokens, this.props.userId);
                if (!result.parsedBody) {
                    return;
                }
                const { properties } = result.parsedBody;
                // ユーザーか、グループかの判定
                if (properties.loginUserName) {
                    const userProps = properties;
                    this.serUserInfo(userProps);
                }
                else {
                    const groupProps = properties;
                    this.setState({
                        userName: groupProps.label,
                        userOrg: groupProps.fullLabel,
                    });
                }
            })();
        };
        this.componentWillUnmount = () => {
            this.$isMounted = false;
        };
        this.onPressUserBadge = () => {
            this.setState({
                shownDetailDialog: true,
            });
        };
        this.onLongPressUserBadge = () => {
            if (!this.props.onLongPress) {
                return;
            }
            const state = clone_1.default(this.state);
            this.props.onLongPress(state.userId);
        };
        this.userInfoPanel = (faceImage) => {
            const { state } = this;
            return react_1.default.createElement(react_native_1.Modal, { visible: this.state.shownDetailDialog, animationType: "slide", transparent: true, onRequestClose: () => { this.setState({ shownDetailDialog: false }); } },
                react_1.default.createElement(native_base_1.Card, { style: { marginTop: 50 } },
                    react_1.default.createElement(native_base_1.CardItem, null,
                        react_1.default.createElement(native_base_1.Body, { style: { flex: 1, flexDirection: 'row' } },
                            react_1.default.createElement(native_base_1.Thumbnail, { source: faceImage, large: true, square: true, style: { flexShrink: 0, flexGrow: 0 } }),
                            react_1.default.createElement(native_base_1.View, { style: { marginLeft: 4, flexShrink: 1, flexGrow: 1 } },
                                react_1.default.createElement(native_base_1.Text, null, state.userName),
                                react_1.default.createElement(native_base_1.Text, null, state.userOrg),
                                react_1.default.createElement(native_base_1.Text, null, state.userEMail),
                                react_1.default.createElement(native_base_1.View, { style: { flexDirection: 'row' } },
                                    react_1.default.createElement(native_base_1.Button, { transparent: true, small: true, onPress: this.onPressMailIcon.bind(this, state.userEMail || '') },
                                        react_1.default.createElement(native_base_1.Icon, { style: shareIconStyle, name: "md-mail" })),
                                    react_1.default.createElement(native_base_1.Button, { transparent: true, small: true, onPress: this.onPressTeamsIcon.bind(this, state.userEMail || '') },
                                        react_1.default.createElement(react_native_1.Image, { style: shareIconStyle, source: ms_teams_png_1.default })))))),
                    react_1.default.createElement(native_base_1.CardItem, { footer: true },
                        react_1.default.createElement(native_base_1.Left, null),
                        react_1.default.createElement(native_base_1.Text, null),
                        react_1.default.createElement(native_base_1.Right, null,
                            react_1.default.createElement(native_base_1.Button, { transparent: true, onPress: () => { this.setState({ shownDetailDialog: false }); } },
                                react_1.default.createElement(native_base_1.Text, { style: { color: this.props.textColor } }, LangProfile_1.langProfile.replaceLang('LK_close')))))));
        };
        this.onPressTeamsIcon = (email) => {
            const url = url_parse_1.default('https://teams.microsoft.com/l/chat/0/0', true);
            url.set('query', {
                users: email,
                message: this.props.shareMessage || '',
            });
            react_native_1.Linking.openURL(url.href);
        };
        this.onPressMailIcon = (email) => {
            const url = url_parse_1.default(`mailto:${email}`);
            url.set('query', {
                body: this.props.shareMessage || '',
            });
            react_native_1.Linking.openURL(url.href);
        };
        this.state = {
            userId: props.userId,
            shownDetailDialog: false,
            type: props.type || 'user',
        };
    }
    render() {
        const altFace = this.props.type === 'user' ? user_png_1.default : group_png_1.default;
        const faceImage = this.state.userFaceUrl ?
            {
                uri: this.state.userFaceUrl,
            } : altFace;
        return (react_1.default.createElement(native_base_1.View, { style: this.props.style },
            react_1.default.createElement(native_base_1.Button, { rounded: true, small: true, color: this.props.badgeColor, onLongPress: this.onLongPressUserBadge, onPress: this.onPressUserBadge },
                react_1.default.createElement(native_base_1.Thumbnail, { source: faceImage, small: true, circular: true }),
                react_1.default.createElement(native_base_1.Text, null, this.state.userName)),
            this.userInfoPanel(faceImage)));
    }
    serUserInfo(userProps) {
        this.setState({
            userEMail: userProps.mailAddress,
            userName: userProps.displayName,
            userOrg: userProps.profile &&
                userProps.profile.department &&
                userProps.profile.department.properties &&
                userProps.profile.department.properties.fullLabel || '',
        });
        if (userProps.faceImage) {
            const eimAccount = EimAccount_1.getEimAccount();
            eimAccount.getServiceAdapter().getAttachmentFile(eimAccount.eimTokens, userProps.faceImage)
                .then((response) => {
                if (response) {
                    this.setState({
                        userFaceUrl: response.url,
                    });
                }
            });
        }
    }
}
UserBadge.defaultProps = {
    badgeColor: '#666',
    textColor: '#000',
    type: 'user',
    onLongPress: (_userId) => { },
};
exports.UserBadge = UserBadge;
