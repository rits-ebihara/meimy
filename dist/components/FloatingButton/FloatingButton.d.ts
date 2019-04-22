import { Component } from 'react';
import { Animated } from 'react-native';
declare type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
interface IProps {
    iconColor?: string;
    iconName?: string;
    iconType?: "Entypo" | "EvilIcons" | "Feather" | "FontAwesome" | "Foundation" | "Ionicons" | "MaterialCommunityIcons" | "MaterialIcons" | "Octicons" | "SimpleLineIcons" | "Zocial";
    label?: string;
    marginHorizontal?: number;
    marginVertical?: number;
    onPress?: () => void;
    position?: Position;
    primaryButtonColor: string;
    primaryButtonSize?: number;
    secondaryButtonSize?: number;
}
interface IState {
    isExpanded: boolean;
    animationScale: Animated.Value;
}
export declare class FloatingButton extends Component<IProps, IState> {
    static defaultProps: Partial<IProps>;
    private animation;
    constructor(props: IProps);
    render: () => JSX.Element;
    componentDidUpdate: (_preProp: IProps, _preState: IState) => void;
    private onButtonClick;
    private createStyle;
}
export {};
