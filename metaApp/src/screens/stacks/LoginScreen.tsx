/* eslint-disable react-native/no-inline-styles */
// import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button, OutlineButton } from '../../components/widgets/Button.tsx';
import { useLogin } from '../../hooks';
import axios from 'axios';
import { setCredentials } from '../../redux/slice/auth.slice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginProps = {
    navigation: any;
};

const Login: React.FC<LoginProps> = ({ navigation }) => {
    const { loginAction, loginLoading } = useLogin();
    const dispatch = useDispatch()

    const [data, setData] = useState({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        errorMsg: '',
    });

    // region DisplayError Msg
    const displayErrorMessage = (msg: string) => (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{msg}</Text>
        </Animatable.View>
    );

    // region TextInput Change
    const textInputChange = (value: string, type: 'EMAIL' | 'PASSWORD') => {
        if (type === 'EMAIL') {
            if (value.trim().length > 4) {
                setData({
                    ...data,
                    email: value,
                    check_textInputChange: true,
                    isValidUser: true,
                    errorMsg: '',
                });
            } else {
                setData({
                    ...data,
                    email: value,
                    check_textInputChange: false,
                    isValidUser: false,
                    errorMsg: 'At least required upper than 4 digits!',
                });
            }
        }

        if (type === 'PASSWORD') {
            if (value.length >= 8) {
                setData({
                    ...data,
                    password: value,
                    isValidPassword: true,
                    errorMsg: '',
                });
            } else {
                setData({
                    ...data,
                    password: value,
                    isValidPassword: false,
                    errorMsg: 'Password should be at least 8 characters!',
                });
            }
        }
    };

    // region UpdateSecure Text
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry,
        });
    };


    // region Handle Login API Call
    const handleLogin = async () => {
        await loginAction({ email: data.email, password: data.password });

        // Clear form
        setData((prev) => ({
            ...prev,
            email: '',
            password: '',
        }));
    };

    // region UI
    return (
        <ImageBackground
            style={styles.container}
            source={require('../../assets/images/post2.jpg')}
        >
            <View style={styles.header}>
                <Text style={styles.text_header}>Sign In</Text>
            </View>

            <Animatable.View style={styles.footer} animation="fadeInUpBig">
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action}>
                    {/* <FontAwesome name="user-o" size={20} color="#05375a" /> */}
                    <TextInput
                        placeholder="Your Email"
                        value={data.email}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(value) => textInputChange(value, 'EMAIL')}

                    />
                    {/* {data.check_textInputChange && <Feather name="check-circle" size={20} color="green" />} */}
                </View>
                {!data.isValidUser && displayErrorMessage(data.errorMsg)}

                <Text style={[styles.text_footer, { marginTop: 30 }]}>Password</Text>
                <View style={styles.action}>
                    {/* <Feather name="lock" size={20} color="#05375a" /> */}
                    <TextInput
                        placeholder="Your Password"
                        value={data.password}
                        secureTextEntry={data.secureTextEntry}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(value) => textInputChange(value, 'PASSWORD')}
                    />
                    <TouchableOpacity onPress={updateSecureTextEntry}>
                        {/* <Feather
                            name={data.secureTextEntry ? 'eye-off' : 'eye'}
                            size={20}
                            color="grey"
                        /> */}
                    </TouchableOpacity>
                </View>
                {!data.isValidPassword && displayErrorMessage(data.errorMsg)}


                <View style={{ marginTop: 30 }}>
                    <Button
                        title="Login"
                        bgColor="royalblue"
                        size={18}
                        textColor="white"
                        height={50}
                        onPress={handleLogin}
                        isLoading={loginLoading}
                    />

                    <View style={{ marginTop: 20 }}>
                        <OutlineButton
                            title="Sign Up"
                            color="orange"
                            size={18}
                            width="100%"
                            height={50}
                            onPress={() => navigation.navigate('Register')}
                        />
                    </View>
                </View>
            </Animatable.View>
        </ImageBackground>
    );
};

// region Style Sheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    text_header: {
        color: '#05375a',
        fontWeight: 'bold',
        fontSize: 30,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 13,
        marginTop: 5,
    },
});

export default Login;


