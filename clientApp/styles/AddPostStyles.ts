import styled from 'styled-components';
import { Dimensions, Platform } from 'react-native';


// Get the screen width
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const Container = (styled as any).View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

export const PostContainer = (styled as any).View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: white;
    max-height: ${Platform.OS === "ios" ? screenHeight - 80 : screenHeight - 10}px;
`;

export const InputWrapper = (styled as any).View`
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #2e64e515;
`;

export const InputField = (styled as any).TextInput`
    justify-content: center;
    align-items: center;
    font-size: 24px;
    text-align: center;
`;