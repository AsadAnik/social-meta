import styled from 'styled-components';
import { Dimensions } from 'react-native';


// Get the screen width
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Get the card width and height
const cardWidth = screenWidth - 10;
const cardHeight = screenHeight * 0.8;


export const Container = (styled as any).View`
    flex: 1;
    background-color: #fff;
    margin-top: ${screenHeight * 0.06};
    max-height: ${screenHeight - 120};
`;

export const NotifyDiv = (styled as any).TouchableOpacity`
    background-color: #fff;
    flex-direction: row;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 10px;
`;

export const NotifyPersonText = (styled as any).Text`
    font-weight: bold;
`;

export const NotifyPersonAvatar = (styled as any).Image`
    height: ${screenHeight * 0.05};
    width: ${screenHeight * 0.05};
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 10px;
`;

export const NotifyRightElement = (styled as any).View`
    margin-left: auto;
    margin-right: 10px;
    justify-content: center;
`;