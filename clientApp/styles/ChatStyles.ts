import styled from 'styled-components';
import { Dimensions, Platform } from 'react-native';


// Get the screen width
// const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Get the card width and height
// const cardWidth = screenWidth - 10;
// const cardHeight = screenHeight * 0.8;


export const Container = (styled as any).View`
    flex: 1;
    align-items: center;
    background-color: #fff;
    padding-left: 5px;
    padding-right: 5px;
    margin-top: ${screenHeight * 0.06};
    max-height: ${Platform.OS === "ios" ? screenHeight - 120 : screenHeight - 50}px;
`;