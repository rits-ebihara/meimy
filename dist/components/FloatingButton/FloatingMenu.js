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
class FloatingMenu extends react_1.Component {
    constructor() {
        super(...arguments);
        this.render = () => {
            const { buttonColor, direction, iconName, iconType, iconSize, label, onPress, disable, } = this.props;
            const styles = react_native_1.StyleSheet.create({
                button: {
                    alignItems: 'center',
                    backgroundColor: disable ? '#aaa' : buttonColor,
                    borderRadius: iconSize / 2,
                    elevation: 5,
                    height: iconSize,
                    justifyContent: 'center',
                    marginLeft: (direction === 'right') ? 24 : 0,
                    marginRight: (direction === 'left') ? 24 : 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 5, height: 5 },
                    shadowOpacity: 0.5,
                    width: iconSize,
                },
                container: {
                    alignContent: 'stretch',
                    flexDirection: (direction === 'left') ? 'row' : 'row-reverse',
                    justifyContent: 'flex-start',
                    marginBottom: 24,
                },
                icon: {
                    color: 'white',
                    fontSize: iconSize * 0.6,
                    position: 'relative',
                },
                label: {
                    backgroundColor: '#ffffff',
                    borderRadius: 10,
                    borderStyle: 'solid',
                    borderWidth: 0,
                    elevation: 2,
                    fontSize: 14,
                    padding: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.5,
                },
                labelBox: {
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            });
            return (react_1.default.createElement(native_base_1.View, { style: styles.container },
                react_1.default.createElement(react_native_1.TouchableOpacity, { style: styles.button, onPress: onPress, disabled: disable },
                    react_1.default.createElement(native_base_1.Icon, { name: iconName || 'check', type: iconType, style: styles.icon })),
                react_1.default.createElement(native_base_1.View, { style: styles.labelBox },
                    react_1.default.createElement(native_base_1.Text, { style: styles.label }, label))));
        };
    }
}
FloatingMenu.defaultProps = {
    buttonColor: '#000099',
    direction: 'right',
    iconName: 'arrow-forward',
    iconSize: 48,
    disable: false,
};
exports.FloatingMenu = FloatingMenu;
