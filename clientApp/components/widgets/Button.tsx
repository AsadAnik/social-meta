import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
            <LinearGradient
                colors={[color1st, color2nd]}
                style={styles.signIn}
            >
                <Text style={[styles.textSign, { color: textColor }]}>{title}</Text>
                {children}
            </LinearGradient>
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