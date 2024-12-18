import styled from 'styled-components';
import { Dimensions, Platform } from 'react-native';



// Get the screen width
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Get the card width and height
const cardWidth = screenWidth - 10;
const cardHeight = screenHeight * 0.8;


export const Container = (styled as any).View`
    flex: 1;
    background-color: #fff;
    margin-top: ${screenHeight * 0.06}px;
    max-height: ${Platform.OS === "ios" ? screenHeight - 80 : screenHeight - 5}px;
`;

export const NotifyDiv = (styled as any).TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
`;

export const NotifyPersonText = (styled as any).Text`
    font-size: 16px;
`;

export const NotifyPersonAvatar = (styled as any).Image`
    height: ${screenHeight * 0.05}px;
    width: ${screenHeight * 0.05}px;
    border-radius: 50px;
    margin-right: 10px;
    margin-left: 10px;
`;

export const NotifyRightElement = (styled as any).View`
    margin-left: auto;
    margin-right: 10px;
    justify-content: center;
`;

export const NotifyLovedImg =  (styled as any).Image`
    height: ${screenHeight * 0.05 + 30}px;
    width: ${screenHeight * 0.05 + 20}px;
    border-radius: 10px;
    margin-right: 10px;
`;