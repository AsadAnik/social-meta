import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const Register: React.FC = () => {
    const router = useRouter();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        title: '',
        birthday: new Date(),
        secureTextEntry: true,
        showDatePicker: false,
        errorMsg: '',
    });

    const handleInputChange = (field: string, value: string | Date) => {
        setData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const toggleSecureTextEntry = () => {
        setData((prevState) => ({
            ...prevState,
            secureTextEntry: !prevState.secureTextEntry,
        }));
    };

    const validateForm = () => {
        const { name, email, password, confirmPassword } = data;
        if (!name.trim()) return 'Name is required.';
        if (!email.includes('@')) return 'Enter a valid email.';
        if (password.length < 8) return 'Password must be at least 8 characters.';
        if (password !== confirmPassword) return 'Passwords do not match.';
        return '';
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setData((prevState) => ({
                ...prevState,
                errorMsg: validationError,
            }));
            return;
        }

        try {
            const response = await fetch('https://your-backend-api.com/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    bio: data.bio,
                    title: data.title,
                    birthday: data.birthday,
                }),
            });

            const result = await response.json();
            if (result.success) {
                router.push('/auth/login');
            } else {
                setData((prevState) => ({
                    ...prevState,
                    errorMsg: result.message || 'Registration failed. Try again.',
                }));
            }
        } catch (error) {
            setData((prevState) => ({
                ...prevState,
                errorMsg: 'An error occurred. Please try again later.',
            }));
        }
    };

    return (
        <ImageBackground
            style={styles.container}
            source={require('../../assets/images/post2.jpg')}
        >
            <View style={styles.header}>
                <Text style={styles.text_header}>Sign Up</Text>
            </View>
            <Animatable.View style={styles.footer} animation="fadeInUpBig">
                <ScrollView showsVerticalScrollIndicator={false}>
                    {['name', 'email', 'password', 'confirmPassword', 'bio', 'title'].map((field) => (
                        <View key={field} style={styles.inputGroup}>
                            <Text style={styles.text_footer}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </Text>
                            <View style={styles.action}>
                                <FontAwesome
                                    name={field === 'email' ? 'envelope-o' : 'user-o'}
                                    size={20}
                                    color="#05375a"
                                />
                                <TextInput
                                    placeholder={`Your ${field}`}
                                    secureTextEntry={field.includes('password') && data.secureTextEntry}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={(value) => handleInputChange(field, value)}
                                />
                                {field.includes('password') && (
                                    <TouchableOpacity onPress={toggleSecureTextEntry}>
                                        <Feather
                                            name={data.secureTextEntry ? 'eye-off' : 'eye'}
                                            size={20}
                                            color="grey"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}

                    {/* Birthday Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.text_footer}>Birthday</Text>
                        <TouchableOpacity
                            onPress={() => handleInputChange('showDatePicker', new Date())}
                        >
                            <Text style={styles.textInput}>
                                {data.birthday.toDateString()}
                            </Text>
                        </TouchableOpacity>
                        {data.showDatePicker && (
                            <DateTimePicker
                                value={data.birthday}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, date) =>
                                    handleInputChange('birthday', date || data.birthday)
                                }
                            />
                        )}
                    </View>

                    {/* Error Message */}
                    {data.errorMsg ? (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{data.errorMsg}</Text>
                        </Animatable.View>
                    ) : null}

                    {/* Submit Button */}
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animatable.View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    text_header: {
        color: '#05375a',
        fontWeight: 'bold',
        fontSize: 28,
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_footer: {
        fontSize: 18,
        color: '#05375a',
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
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#05375a',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Register;
