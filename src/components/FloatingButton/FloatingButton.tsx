import { Icon, Text, View } from 'native-base';
import React, { Component, ReactElement } from 'react';
import { Animated, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { IFloatingMenuProps } from './FloatingMenu';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
interface IProps {
    iconColor?: string;
    iconName?: string;
    iconType?: 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'Foundation'
    | 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'Octicons' | 'SimpleLineIcons' | 'Zocial';
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

export class FloatingButton extends Component<IProps, IState> {
    public static defaultProps: Partial<IProps> = {
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

    private animation: Animated.CompositeAnimation;
    public constructor(props: IProps) {
        super(props);
        this.state = {
            animationScale: new Animated.Value(0),
            isExpanded: false,
        };
        this.animation = Animated.timing(
            this.state.animationScale,
            {
                duration: 300,
                toValue: 1,
            },
        );
    }
    public render = () => {
        const {
            secondaryButtonSize,
            position,
            iconName,
            iconType,
            label,
        } = this.props;
        const styles = this.createStyle(this.props);
        const cloneChildren = React.Children.map(this.props.children,
            (child) => {
                if (!child) { return null; }
                return React.cloneElement(child as ReactElement<IFloatingMenuProps>, {
                    direction: /right$/.test(position as Position) ? 'right' : 'left',
                    iconSize: secondaryButtonSize,
                });
            });

        return (
            <View style={styles.container}>
                {(this.state.isExpanded) ?
                    < Animated.View style={{
                        ...styles.childContainer as ViewStyle,
                        opacity: this.state.animationScale,
                        position: 'relative',
                    }}>
                        {cloneChildren}
                    </Animated.View> : null
                }
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={this.onButtonClick}>
                        <Icon name={iconName as string} type={iconType} style={styles.icon} />
                        {!!label ?
                            <Text style={styles.buttonLabel}>{label}</Text>
                            : null}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    public componentDidUpdate = (_preProp: IProps, _preState: IState) => {
        if (this.state.isExpanded) {
            this.animation.start();
        }
    }

    private onButtonClick = () => {
        if (this.props.onPress) {
            this.props.onPress();
            return;
        }
        if (this.state.isExpanded) {
            this.state.animationScale.setValue(0);
        } else {
            this.animation.start();
        }
        this.setState({
            isExpanded: !this.state.isExpanded,
        });
    }

    private createStyle(props: IProps) {
        const {
            primaryButtonColor,
            marginHorizontal,
            marginVertical,
            iconColor,
        } = props;
        const primaryButtonSize = props.primaryButtonSize as number;
        const secondaryButtonSize = props.secondaryButtonSize as number;
        const position = props.position as Position;

        return StyleSheet.create({
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
