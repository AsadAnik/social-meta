import React from 'react';
// import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ImageBackground,
    Text,
    Platform
} from 'react-native';
import Swiper from 'react-native-swiper';

// Screen1 Component
const Screen1 = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            {/* <StatusBar style="light" /> */}
            <ImageBackground
                style={styles.image}
                source={require('../../assets/images/post1.jpg')}
            >
                <View style={styles.darkSheet}>
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => navigation.navigate('Splash')}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>

                    <View style={styles.contentView}>
                        <Text style={styles.heading}>Welcome</Text>
                        <Text style={styles.description}>
                            This is the Social Meta of {Platform.OS} Platform here.
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};
// Screen2 Component
const Screen2 = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            {/* <StatusBar style="light" /> */}
            <ImageBackground
                style={styles.image}
                source={require('../../assets/images/post2.jpg')}
            >
                <View style={styles.darkSheet}>
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => navigation.navigate('Splash')}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>

                    <View style={styles.contentView}>
                        <Text style={styles.heading}>Stay Happy</Text>
                        <Text style={styles.description}>
                            Share Your Moments & Feelings to Others. Stay happy with Our Social Meta.
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

// Screen3 Component
const Screen3 = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            {/* <StatusBar style="light" /> */}
            <ImageBackground
                style={styles.image}
                source={require('../../assets/images/post3.jpg')}
            >
                <View style={styles.darkSheet}>
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={() => navigation.navigate('Splash')}
                    >
                        <Text style={styles.getStartedText}>Get Started</Text>
                    </TouchableOpacity>

                    <View style={styles.contentView}>
                        <Text style={styles.heading}>High Secure Messaging</Text>
                        <Text style={styles.description}>
                            We provide the best secure messaging without any risks or doubts.
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

// Onboarding Component
const Onboarding = (props: any) => {
    return (
        <View style={styles.container}>
            <Swiper>
                <Screen1 {...props} />
                <Screen2 {...props} />
                <Screen3 {...props} />
            </Swiper>
        </View>
    );
};

export default Onboarding;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    darkSheet: {
        backgroundColor: 'black',
        height: '100%',
        width: '100%',
        opacity: 0.7,
        position: 'absolute',
    },
    image: {
        flex: 1,
    },
    skipButton: {
        marginTop: '20%',
        marginLeft: 20,
    },
    skipText: {
        fontSize: 20,
        color: 'white',
    },
    getStartedButton: {
        marginTop: '20%',
        marginLeft: 20,
        borderWidth: 2,
        borderColor: 'white',
        padding: 5,
    },
    getStartedText: {
        fontSize: 20,
        color: 'white',
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: 'white',
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    contentView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30%',
    },
});
