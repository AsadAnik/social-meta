import React from 'react';
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { LogBox } from 'react-native';

// Suppress specific warning messages
LogBox.ignoreLogs([
  'Support for defaultProps will be removed from function components in a future major release',
]);

export default function Root() {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>

            <Text style={{ fontSize: 50 }}>Hello World</Text>
            <Link href="/home/home" style={styles.navButton}>Go to Home</Link>
            <Link href="/auth/login" style={styles.navButton}>Go to Auth</Link>
        </View>
    );
}


const styles = StyleSheet.create({
    navButton: {
        margin: 10,
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 10,
        color: 'black',
        fontWeight: 'bold',
    }
});