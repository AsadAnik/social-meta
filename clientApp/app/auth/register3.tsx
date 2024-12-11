import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Platform,
    TextInput,
    Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, OutlineButton } from '../../components/widgets/Button';

// Define props for navigation and route
type Register3Props = NativeStackScreenProps<any, 'Register3'>;

interface DataState {
    bio: string;
    title: string;
    birthDate: string;
    [key: string]: any; // for dynamic properties from route.params
}

const Register3: React.FC<Register3Props> = ({ navigation, route }) => {
    const [data, setData] = useState<DataState>({
        ...route.params,
        bio: '',
        title: '',
        birthDate: '',
    });

    const [date, setDate] = useState<Date>(new Date());
    const [dateModalOpen, setDateModalOpen] = useState<boolean>(false);

    const handleOnDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setDateModalOpen(false); // Close the date picker for Android
        }
        if (selectedDate) {
            setDate(selectedDate);
            setData({ ...data, birthDate: selectedDate.toISOString().split('T')[0] });
        }
    };

    const textInputChange = (value: string, type: keyof DataState) => {
        setData((prevData) => ({
            ...prevData,
            [type]: value,
        }));
    };

    return (
        <ImageBackground
            style={styles.container}
            source={require('../../assets/images/post1.jpg')}
        >
            <StatusBar style="light" />

            {/* ---- Header ---- */}
            <View style={styles.header}>
                <Text style={styles.text_header}>Sign Up</Text>
            </View>

            {/* ---- Footer ---- */}
            <Animatable.View
                style={styles.footer}
                animation="fadeInUpBig"
            >
                {/* ---- Bio ---- */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Bio</Text>
                <View style={styles.action}>
                    <MaterialCommunityIcons name="bio" size={20} color="#05375a" />
                    <TextInput
                        placeholder="I am Simple Human"
                        style={styles.textInput}
                        onChangeText={(value) => textInputChange(value, 'bio')}
                        value={data.bio}
                    />
                </View>

                {/* ---- Title ---- */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Title</Text>
                <View style={styles.action}>
                    <MaterialCommunityIcons name="subtitles-outline" size={20} color="#05375a" />
                    <TextInput
                        placeholder="Doctor"
                        style={styles.textInput}
                        onChangeText={(value) => textInputChange(value, 'title')}
                        value={data.title}
                    />
                </View>

                {/* ---- Birth Date ---- */}
                <Text style={[styles.text_footer, { marginTop: 20 }]}>Birth Date</Text>
                <View style={styles.action}>
                    <FontAwesome name="birthday-cake" size={20} color="#05375a" />
                    <TextInput
                        placeholder="YYYY-MM-DD"
                        style={styles.textInput}
                        value={data.birthDate}
                        editable={false} // Birthdate is selected via Date Picker
                    />
                    <OutlineButton
                        title="Select Date"
                        onPress={() => setDateModalOpen(true)}
                    />
                </View>

                {dateModalOpen && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleOnDateChange}
                    />
                )}

                {/* ---- Buttons ---- */}
                <View style={{ marginTop: 30 }}>
                    <Button
                        title="Register"
                        color1st="lightgreen"
                        color2nd="green"
                        size={18}
                        textColor="white"
                        width="100%"
                        height={50}
                        onPress={() => navigation.navigate('UploadProfile')}
                    />

                    <View style={{ marginTop: 20 }}>
                        <OutlineButton
                            title="Back"
                            color="red"
                            size={18}
                            width="100%"
                            height={50}
                            onPress={() => navigation.navigate('Register2')}
                        />
                    </View>
                </View>
            </Animatable.View>
        </ImageBackground>
    );
};

// Styling Part..
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
        flex: 3,
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

export default Register3;
