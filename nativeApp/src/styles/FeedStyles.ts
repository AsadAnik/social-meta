import styled from 'styled-components';
import { Dimensions, Platform } from 'react-native';


// Get the screen width
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Get the card width and height
const cardWidth = screenWidth - 10;
const cardHeight = screenHeight * 0.9;


export const Container = (styled as any).View`
    flex: 1;
    align-items: center;
    background-color: #fff;
    padding-left: 5px;
    padding-right: 5px;
    margin-top: ${screenHeight * 0.06}px;
    max-height: ${Platform.OS === "ios" ? screenHeight - 120 : screenHeight - 50}px;
`;

export const Card = (styled as any).View`
    background-color: #f8f8f8;
    width: ${cardWidth};
    max-height: ${cardHeight}px;
    margin-bottom: 20px;
    border-radius: 10px;
`;

export const UserInfo = (styled as any).View`
    flex-direction: row;
    justify-content: flex-start;
    padding: 15px;
`;

export const UserImg = (styled as any).Image`
    width: 50px;
    height: 50px;
    border-radius: 25px;
`;

export const UserInfoText = (styled as any).View`
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
`;

export const UserName = (styled as any).Text`
    font-size: 14px;
    font-weight: bold;
    /* font-family: 'Lato-Regular'; */
`;

export const PostTime = (styled as any).Text`
    font-size: 12px;
    /* font-family: 'Lato-Regular'; */
    color: #666;
`;

export const PostText = (styled as any).Text`
    font-size: 14px;
    /* font-family: 'Lato-Regular'; */
    padding-left: 15px;
    padding-right: 15px;
`;

export const PostImg = (styled as any).Image`
    width: 100%;
    height: 450px;
    margin-top: 15px;
`;

export const InteractionWrapper = (styled as any).View`
    flex-direction: row;
    justify-content: space-around;
    padding: 15px;
`;

export const Interaction = (styled as any).TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    border-radius: 5px;
    padding: 2px 5px;
    color: ${(props: any) => props.active ? 'red' : 'transparent'};
`;

export const InteractionText = (styled as any).Text`
    font-size: 12px;
    /* font-family: 'Lato-Regular'; */
    font-weight: bold;
    color: ${(props: any) => props.active ? 'red' : '#333'};
    margin-top: 5px;
    margin-left: 5px;
`;

export const Divider = (styled as any).View`
    border-bottom-color: #ddd;
    border-bottom-width: 1px;
    width: 95%;
    align-self: center;
    margin-top: 15px;
`;