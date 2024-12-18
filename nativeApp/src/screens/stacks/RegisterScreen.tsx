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
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import { FontAwesome } from '@expo/vector-icons';
import { Button, OutlineButton } from '../../components/widgets/Button';
// import { useRouter } from 'expo-router';

type RegisterProps = {
    navigation: any; // Replace `any` with the correct type if you have navigation types available.
};

const Register: React.FC<RegisterProps> = ({ navigation }) => {
    // const router = useRouter();
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
    });

    const [error, setError] = useState({
        firstNameErrorMsg: '',
        lastNameErrorMsg: '',
        isValidFirstName: true,
        isValidLastName: true,
    });

    // Displaying Error Message Dynamically
    const displayErrorMessage = (msg: string) => (
        <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{msg}</Text>
        </Animatable.View>
    );

    // End Of Editing Input Fields
    const handleEndEditing = (
        event: NativeSyntheticEvent<TextInputEndEditingEventData>,
        type: string
    ) => {
        const value = event.nativeEvent.text;

        if (type === 'FNAME') {
            if (value.trim().length > 0 && value.trim().length <= 2) {
                setError({
                    ...error,
                    firstNameErrorMsg: 'Name should be at least 3 characters.',
                    isValidFirstName: false,
                });
            } else {
                setError({
                    ...error,
                    isValidFirstName: true,
                });
            }
        }
    };

    // Text Change Input Fields
    const handleOnChange = (value: string, type: string) => {
        if (type === 'LNAME') {
            if (value === data.firstName) {
                setError({
                    ...error,
                    lastNameErrorMsg: "Last Name & First Name can't be the same",
                    isValidLastName: false,
                });
            } else {
                setData({
                    ...data,
                    lastName: value,
                });
                setError({
                    ...error,
                    isValidLastName: true,
                });
            }
        } else if (type === 'FNAME') {
            setData({
                ...data,
                firstName: value,
            });
        }
    };

    const handleOnNextPress = () => {
        if (data.firstName && data.lastName) {
            if (error.isValidFirstName && error.isValidLastName) {
                // navigation.navigate('Register2', data);
                
                // router.push({
                //     pathname: "/auth/register2",
                //     params: {
                //         navigation: navigation as any,
                //         params: data as any,
                //     },
                // });
            }
        }
    };

    return (
        <ImageBackground
            style={styles.container}
            source={require('../../assets/images/post1.jpg')}
        >
            {/* <StatusBar style="light" /> */}

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.text_header}>Say Us Your Name</Text>
            </View>

            {/* Footer */}
            <Animatable.View style={styles.footer} animation="fadeInUpBig">
                {/* FirstName */}
                <Text style={styles.text_footer}>First Name</Text>
                <View style={styles.action}>
                    {/* <FontAwesome name="user-o" size={20} color="#05375a" /> */}
                    <TextInput
                        placeholder="Asad"
                        style={styles.textInput}
                        onChangeText={(value) => handleOnChange(value, 'FNAME')}
                        onEndEditing={(event) => handleEndEditing(event, 'FNAME')}
                        autoCorrect={false}
                    />
                </View>
                {/* Display Error */}
                {!error.isValidFirstName && displayErrorMessage(error.firstNameErrorMsg)}

                {/* LastName */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Last Name</Text>
                <View style={styles.action}>
                    {/* <FontAwesome name="user-o" size={20} color="#05375a" /> */}
                    <TextInput
                        placeholder="Anik"
                        style={styles.textInput}
                        onChangeText={(value) => handleOnChange(value, 'LNAME')}
                        autoCorrect={false}
                    />
                </View>
                {/* Display Error */}
                {!error.isValidLastName && displayErrorMessage(error.lastNameErrorMsg)}

                {/* Buttons */}
                <View style={{ marginTop: 30 }}>
                    <Button
                        title="Next"
                        color1st="royalblue"
                        color2nd="blue"
                        size={18}
                        textColor="white"
                        width="100%"
                        height={50}
                        onPress={handleOnNextPress}
                    />
                    <View style={{ marginTop: 20 }}>
                        <OutlineButton
                            title="Sign In"
                            color="orange"
                            size={18}
                            width="100%"
                            height={50}
                            onPress={() => navigation.navigate('Login')}
                        />
                    </View>
                </View>
            </Animatable.View>
        </ImageBackground>
    );
};

// Styles
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
        backgroundColor: 'white',
        padding: 5,
        opacity: 0.7,
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
        marginTop: -12,
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

export default Register;
