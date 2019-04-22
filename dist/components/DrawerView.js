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
const EimAccount_1 = __importDefault(require("../account-manager/EimAccount"));
const user_png_1 = __importDefault(require("../resources/user.png"));
class DrawerContent extends react_1.Component {
    constructor(props) {
        super(props);
        this.$isMounted = false;
        this.componentDidMount = () => {
            this.$isMounted = true;
            const { user } = EimAccount_1.default;
            const faceImage = user ? user.properties.faceImage : null;
            if (!faceImage) {
                return;
            }
            EimAccount_1.default.getServiceAdapter()
                .getAttachmentFile(EimAccount_1.default.eimTokens, faceImage)
                .then((result) => {
                if (!this.$isMounted) {
                    return;
                }
                this.setState({
                    avatarFaceUrl: {
                        uri: result.url,
                    },
                });
            });
        };
        this.componentWillUnmount = () => {
            this.$isMounted = false;
        };
        this.onPressChangeSite = async () => {
            EimAccount_1.default.clear();
            await EimAccount_1.default.save();
            this.props.navigation.navigate(this.props.splashPageName);
        };
        this.state = {};
    }
    render() {
        const viewStyle = {
            borderBottomColor: this.props.borderColor,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            padding: 10,
        };
        const rowStyle = Object.assign({}, viewStyle, {
            flexDirection: 'row',
        });
        const colStyle = Object.assign({}, viewStyle, {
            flexDirection: 'column',
        });
        if (!EimAccount_1.default.user) {
            return null;
        }
        const { user } = EimAccount_1.default;
        return (react_1.default.createElement(native_base_1.View, null,
            react_1.default.createElement(native_base_1.View, { style: { flexDirection: 'row-reverse' } },
                react_1.default.createElement(native_base_1.Button, { transparent: true, onPress: () => this.props.navigation.toggleDrawer() },
                    react_1.default.createElement(native_base_1.Text, null, "\u9589\u3058\u308B"))),
            react_1.default.createElement(native_base_1.View, { style: rowStyle },
                react_1.default.createElement(native_base_1.View, { style: { width: 88 } },
                    react_1.default.createElement(native_base_1.Thumbnail, { circular: true, large: true, source: this.state.avatarFaceUrl || user_png_1.default })),
                react_1.default.createElement(native_base_1.View, { style: { width: 180 } },
                    react_1.default.createElement(native_base_1.Text, null, user ? user.properties.displayName : ''),
                    react_1.default.createElement(native_base_1.Text, null, EimAccount_1.default.getDepartmentName()))),
            react_1.default.createElement(native_base_1.View, { style: colStyle },
                react_1.default.createElement(native_base_1.Text, null),
                react_1.default.createElement(native_base_1.Text, { note: true }, EimAccount_1.default.domain),
                react_1.default.createElement(native_base_1.Button, { bordered: true, color: this.props.buttonColor, iconLeft: true, rounded: true, style: { alignSelf: 'center', margin: 10 }, onPress: this.onPressChangeSite.bind(this) },
                    react_1.default.createElement(native_base_1.Icon, { name: "md-swap" }),
                    react_1.default.createElement(native_base_1.Text, null, "\u63A5\u7D9A\u5148\u306E\u5207\u308A\u66FF\u3048"))),
            react_1.default.createElement(native_base_1.View, { style: colStyle },
                react_1.default.createElement(native_base_1.Text, { note: true }, "\u3053\u306E\u30A2\u30D7\u30EA\u306B\u3064\u3044\u3066"),
                react_1.default.createElement(native_base_1.Text, { style: {
                        fontSize: 16,
                        fontWeight: 'bold',
                    } }, this.props.appDisplayName),
                react_1.default.createElement(native_base_1.Text, { style: { alignSelf: 'flex-end' } },
                    "ver.",
                    this.props.appVersion))));
    }
}
exports.DrawerContent = DrawerContent;
