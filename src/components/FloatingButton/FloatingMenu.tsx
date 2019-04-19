import { Icon, Text, View } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export interface IFloatingMenuProps {
    buttonColor?: string;
    direction?: 'left' | 'right';
    iconName?: string;
    iconType?: "Entypo" | "EvilIcons" | "Feather" | "FontAwesome" | "Foundation" | "Ionicons"
    | "MaterialCommunityIcons" | "MaterialIcons" | "Octicons" | "SimpleLineIcons" | "Zocial";
    iconSize?: number;
    label?: string;
    onPress: () => void;
}
export class FloatingMenu extends Component<IFloatingMenuProps> {
    public static defaultProps: Partial<IFloatingMenuProps> = {
        buttonColor: '#000099',
        direction: 'right',
        iconName: 'arrow-forward',
        iconSize: 48,
    };
    public render = () => {
        const {
            buttonColor,
            direction,
            iconName,
            iconType,
            iconSize,
            label,
            onPress,
        } = this.props;
        const styles = StyleSheet.create({
            button: {
                alignItems: 'center',
                backgroundColor: buttonColor,
                borderRadius: iconSize as number / 2,
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
                fontSize: iconSize as number * 0.6,
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
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Icon name={iconName || 'check'} type={iconType} style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.labelBox}>
                    <Text style={styles.label}>{label}</Text>
                </View>
            </View>
        );
    }
}
