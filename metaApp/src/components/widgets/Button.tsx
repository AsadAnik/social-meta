import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { FollowButtonType, ButtonType, IconButtonType } from '../../lib/types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Button Component..
// region Normal Button
export const Button = ({
  title,
  bgColor,
  size,
  textColor,
  width,
  height,
  onPress,
  children,
  isLoading,
}: ButtonType) => {
  // Styles..
  const styles = StyleSheet.create({
    signIn: {
      width: width ?? '100%',
      height: height ?? 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: bgColor ?? 'blue',
    },
    textSign: {
      fontSize: size,
      fontWeight: 'bold',
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.signIn}>
      <Text style={[styles.textSign, { color: textColor ?? 'white' }]}>{!isLoading ? title : 'Loading..'}</Text>
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
      borderRadius: 10,
    },
    textSign: {
      fontSize: size,
      fontWeight: 'bold',
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.signIn, {
        borderColor: color,
        borderWidth: 1,
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
      borderRadius: 10,
    },
    textSign: {
      fontSize: size,
      fontWeight: 'bold',
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.signIn, {
        backgroundColor: 'blue',
        borderWidth: 1,
        borderColor: 'royalblue',
      }]}
    >
      <Text style={[{ color: 'white', fontSize: Math.abs(size - 15) }]}>{title}</Text>
      {children}
    </TouchableOpacity>

  );
};


// Icon Button Component
// region Icon Button
export const IconButton = ({ title, isLoading, onPress, bgColor = '#1DA1F2', iconName = 'send' }: IconButtonType) => {
  // Styles..
  const styles = StyleSheet.create({
    submitButton: {
      backgroundColor: bgColor,
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginTop: 20,
      minWidth: '80%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: '#A8D5F7',
    },
    submitButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    submitButtonTextContainer: {
      marginLeft: 8,
    },
    submitButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.submitButton,
        isLoading && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View style={styles.submitButtonContent}>
          <FontAwesome name={iconName} size={16} color="#fff" />

          <View style={styles.submitButtonTextContainer}>
            {/* Fixed: Changed View to Text component */}
            <Text style={styles.submitButtonText}>{title}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
