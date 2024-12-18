import React, { useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    NativeSyntheticEvent,
    TextInputEndEditingEventData,
    Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, OutlineButton } from '../../components/widgets/Button';
// import { useLocalSearchParams } from 'expo-router';
// import { useRouter } from 'expo-router';

// Define Props for Register2
type Register2Props = {
    navigation?: {
        navigate: any,
    };
    route?: {
        params: {
            [key: string]: any;
        };
    };
};

// Define State Types
type DataState = {
    email: string;
    password: string;
    retypePassword: string;
    check_textInputChange: boolean;
    secureTextEntry: boolean;
};

type ErrorState = {
    emailErrorMsg: string;
    passwordErrorMsg: string;
    rePasswordErrorMsg: string;
    isValidEmail: boolean;
    isValidPassword: boolean;
    isValidRePassword: boolean;
};

const Register2: React.FC<Register2Props> = () => {
    // const { params } = useLocalSearchParams();
    // const router = useRouter();

    const [data, setData] = useState<DataState>({
        // ...(params as any),
        email: '',
        password: '',
        retypePassword: '',
        check_textInputChange: false,
        secureTextEntry: true,
    });

    const [error, setError] = useState<ErrorState>({
        emailErrorMsg: '',
        passwordErrorMsg: '',
        rePasswordErrorMsg: '',
        isValidEmail: true,
        isValidPassword: true,
        isValidRePassword: true,
    });

    // Display error messages
    const displayErrorMessage = (msg: string) => (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{msg}</Text>
        </Animatable.View>
    );

    // Handle valid email
    const handleValidEmail = (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        const value = event.nativeEvent.text.trim();
        const emailTest = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);

        if (!emailTest) {
            setData((prev) => ({ ...prev, check_textInputChange: false }));
            setError((prev) => ({
                ...prev,
                isValidEmail: false,
                emailErrorMsg: 'Email is not valid!',
            }));
        } else {
            setData((prev) => ({ ...prev, check_textInputChange: true }));
            setError((prev) => ({
                ...prev,
                isValidEmail: true,
            }));
        }
    };

    // Handle text changes
    const textInputChange = (value: string, type: 'EMAIL' | 'PASSWORD' | 'RETYPE-PASSWORD') => {
        if (type === 'EMAIL') {
            setData((prev) => ({ ...prev, email: value, check_textInputChange: value.length > 0 }));
        }

        if (type === 'PASSWORD') {
            if (value.length < 8) {
                setError((prev) => ({
                    ...prev,
                    isValidPassword: false,
                    passwordErrorMsg: 'Password should be at least 8 characters',
                }));
            } else {
                setError((prev) => ({ ...prev, isValidPassword: true }));
            }
            setData((prev) => ({ ...prev, password: value }));
        }

        if (type === 'RETYPE-PASSWORD') {
            if (value !== data.password) {
                setError((prev) => ({
                    ...prev,
                    isValidRePassword: false,
                    rePasswordErrorMsg: 'Passwords do not match!',
                }));
            } else {
                setError((prev) => ({ ...prev, isValidRePassword: true }));
                setData((prev) => ({ ...prev, retypePassword: value }));
            }
        }
    };

    // Handle next button press
    const handleOnNextPress = () => {
        if (error.isValidEmail && error.isValidPassword && error.isValidRePassword) {
            // Navigate..
            // router.push({
            //     pathname: '/auth/register3' as const,
            //     params: {
            //         email: data.email,
            //         password: data.password,
            //         retypePassword: data.retypePassword,
            //     },
            // });
        }
    };

    // Toggle secure text entry
    const updateSecureTextEntry = () => {
        setData((prev) => ({ ...prev, secureTextEntry: !prev.secureTextEntry }));
    };

    return (
        <ImageBackground style={styles.container} source={require('../../assets/images/post1.jpg')}>
            {/* <StatusBar style="light" /> */}

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.text_header}>Sign Up</Text>
            </View>

            {/* Footer */}
            <Animatable.View style={styles.footer} animation="fadeInUpBig">
                {/* Email */}
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                    {/* <MaterialCommunityIcons name="email-multiple-outline" size={20} color="#05375a" /> */}
                    <TextInput
                        placeholder="dr.asadanik@gmail.com"
                        style={styles.textInput}
                        onChangeText={(value) => textInputChange(value, 'EMAIL')}
                        onEndEditing={handleValidEmail}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {/* {data.check_textInputChange && <Feather name="check-circle" size={20} color="green" />} */}
                </View>
                {!error.isValidEmail && displayErrorMessage(error.emailErrorMsg)}

                {/* Password */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Password</Text>
                <View style={styles.action}>
                    {/* <Feather name="lock" size={20} color="#05375a" /> */}
                    <TextInput
                        placeholder="abcABC123!@#$"
                        secureTextEntry={data.secureTextEntry}
                        style={styles.textInput}
                        onChangeText={(value) => textInputChange(value, 'PASSWORD')}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={updateSecureTextEntry}>
                        {/* <Feather name={data.secureTextEntry ? 'eye-off' : 'eye'} size={20} color="grey" /> */}
                    </TouchableOpacity>
                </View>
                {!error.isValidPassword && displayErrorMessage(error.passwordErrorMsg)}

                {/* Retype Password */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Retype Password</Text>
                <View style={styles.action}>
                    {/* <Feather name="lock" size={20} color="#05375a" /> */}
                    <TextInput
                        placeholder="abcABC123!@#$"
                        secureTextEntry={data.secureTextEntry}
                        style={styles.textInput}
                        onChangeText={(value) => textInputChange(value, 'RETYPE-PASSWORD')}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={updateSecureTextEntry}>
                        {/* <Feather name={data.secureTextEntry ? 'eye-off' : 'eye'} size={20} color="grey" /> */}
                    </TouchableOpacity>
                </View>
                {!error.isValidRePassword && displayErrorMessage(error.rePasswordErrorMsg)}

                {/* Buttons */}
                <View style={{ marginTop: 30 }}>
                    <Button title="Next" color1st="royalblue" color2nd="blue" textColor="white" onPress={handleOnNextPress} />
                    <View style={{ marginTop: 20 }}>
                        {/* <OutlineButton title="Back" color="red" onPress={() => router.back()} /> */}
                    </View>
                </View>
            </Animatable.View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'royalblue',
    },
    header: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    text_header: {
        color: '#05375a',
        fontWeight: 'bold',
        fontSize: 30,
        backgroundColor: 'white',
        padding: 5,
        opacity: 0.7
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorMsg: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 13,
        marginTop: 5,
    }
});
export default Register2;
