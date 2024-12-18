import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FollowButtonType } from '../../types';

// Button Component..
// region Normal Button
export const Button = ({ title, color1st, color2nd, size, textColor, width, height, onPress, children }: any) => {
    // Styles..
    const styles = StyleSheet.create({
        signIn: {
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        textSign: {
            fontSize: size,
            fontWeight: 'bold',
        }
    });

    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={[styles.textSign, { color: textColor }]}>{title}</Text>
            {children}
        </TouchableOpacity>

    );
};

// Outlined Bottom Component..
// region Outlined Button
export const OutlineButton = ({ title, color, height, width, size, onPress, children }: any) => {
    // Styles..
    const styles = StyleSheet.create({
        signIn: {
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        textSign: {
            fontSize: size,
            fontWeight: 'bold',
        }
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.signIn, {
                borderColor: color,
                borderWidth: 1
            }]}
        >
            <Text style={[styles.textSign, { color: '#05375a' }]}>{title}</Text>
            {children}
        </TouchableOpacity>
    );
};

// The Follow Button Component..
// region Follow Button
export const FollowButton = ({ title, size, onPress, children }: FollowButtonType) => {
    // Styles..
    const styles = StyleSheet.create({
        signIn: {
            width: size * 2.5,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        textSign: {
            fontSize: size,
            fontWeight: 'bold',
        }
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.signIn, {
                backgroundColor: 'blue',
                borderWidth: 1,
                borderColor: 'royalblue'
            }]}
        >
            <Text style={[{ color: 'white', fontSize: Math.abs(size - 15) }]}>{title}</Text>
            {children}
        </TouchableOpacity>

    );
};