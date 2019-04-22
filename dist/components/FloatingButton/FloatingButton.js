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
class FloatingButton extends react_1.Component {
    constructor(props) {
        super(props);
        this.render = () => {
            const { secondaryButtonSize, position, iconName, iconType, label, } = this.props;
            const styles = this.createStyle(this.props);
            const cloneChildren = react_1.default.Children.map(this.props.children, (child) => {
                if (!child) {
                    return null;
                }
                return react_1.default.cloneElement(child, {
                    direction: /right$/.test(position) ? 'right' : 'left',
                    iconSize: secondaryButtonSize,
                });
            });
            return (react_1.default.createElement(native_base_1.View, { style: styles.container },
                (this.state.isExpanded) ?
                    react_1.default.createElement(react_native_1.Animated.View, { style: {
                            ...styles.childContainer,
                            opacity: this.state.animationScale,
                            position: 'relative',
                        } }, cloneChildren) : null,
                react_1.default.createElement(native_base_1.View, { style: styles.buttonContainer },
                    react_1.default.createElement(react_native_1.TouchableOpacity, { style: styles.button, onPress: this.onButtonClick },
                        react_1.default.createElement(native_base_1.Icon, { name: iconName, type: iconType, style: styles.icon }),
                        !!label ?
                            react_1.default.createElement(native_base_1.Text, { style: styles.buttonLabel }, label)
                            : null))));
        };
        this.componentDidUpdate = (_preProp, _preState) => {
            if (this.state.isExpanded) {
                this.animation.start();
            }
        };
        this.onButtonClick = () => {
            if (this.props.onPress) {
                this.props.onPress();
                return;
            }
            if (this.state.isExpanded) {
                this.state.animationScale.setValue(0);
            }
            else {
                this.animation.start();
            }
            this.setState({
                isExpanded: !this.state.isExpanded,
            });
        };
        this.state = {
            animationScale: new react_native_1.Animated.Value(0),
            isExpanded: false,
        };
        this.animation = react_native_1.Animated.timing(this.state.animationScale, {
            duration: 300,
            toValue: 1,
        });
    }
    createStyle(props) {
        const { primaryButtonColor, marginHorizontal, marginVertical, iconColor, } = props;
        const primaryButtonSize = props.primaryButtonSize;
        const secondaryButtonSize = props.secondaryButtonSize;
        const position = props.position;
        return react_native_1.StyleSheet.create({
            button: {
                alignItems: 'center',
                backgroundColor: primaryButtonColor,
                borderRadius: primaryButtonSize / 2,
                elevation: 5,
                height: primaryButtonSize,
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.5,
                width: primaryButtonSize,
            },
            buttonContainer: {
                flexDirection: 'row',
                justifyContent: /right$/.test(position) ? 'flex-end' : 'flex-start',
            },
            buttonLabel: {
                color: iconColor,
                fontSize: primaryButtonSize / 4,
            },
            childContainer: {
                flexDirection: 'column',
                justifyContent: 'flex-end',
                paddingLeft: /left$/.test(position) ? (primaryButtonSize - secondaryButtonSize) / 2 : 0,
                paddingRight: /right$/.test(position) ? (primaryButtonSize - secondaryButtonSize) / 2 : 0,
            },
            container: {
                bottom: (/^bottom/.test(position)) ? marginVertical : 'auto',
                flex: 1,
                flexDirection: 'column',
                justifyContent: /right$/.test(position) ? 'flex-end' : 'flex-start',
                left: (/left$/.test(position)) ? marginHorizontal : 'auto',
                position: 'absolute',
                right: (/right$/.test(position)) ? marginHorizontal : 'auto',
                top: (/^top/.test(position)) ? marginVertical : 'auto',
                width: 150,
            },
            icon: {
                color: iconColor,
                fontSize: Math.floor(primaryButtonSize * 0.5),
                margin: 'auto',
            },
        });
    }
}
FloatingButton.defaultProps = {
    iconColor: 'white',
    iconName: 'add',
    iconType: 'Ionicons',
    label: '',
    marginHorizontal: 32,
    marginVertical: 32,
    position: 'bottom-right',
    primaryButtonColor: '#000099',
    primaryButtonSize: 56,
    secondaryButtonSize: 48,
};
exports.FloatingButton = FloatingButton;
