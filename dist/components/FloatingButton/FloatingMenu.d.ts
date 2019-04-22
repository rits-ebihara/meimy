import { Component } from 'react';
export interface IFloatingMenuProps {
    buttonColor?: string;
    direction?: 'left' | 'right';
    iconName?: string;
    iconType?: "Entypo" | "EvilIcons" | "Feather" | "FontAwesome" | "Foundation" | "Ionicons" | "MaterialCommunityIcons" | "MaterialIcons" | "Octicons" | "SimpleLineIcons" | "Zocial";
    iconSize?: number;
    label?: string;
    onPress: () => void;
}
export declare class FloatingMenu extends Component<IFloatingMenuProps> {
    static defaultProps: Partial<IFloatingMenuProps>;
    render: () => JSX.Element;
}
