import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  color: black;
`;

export const Footer = styled.View`
  flex: 2;
  background-color: #fff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding-vertical: 30px;
  padding-horizontal: 20px;
`;

export const TextHeader = styled.Text`
  color: #05375a;
  font-weight: bold;
  font-size: 30px;
`;

export const TextFooter = styled.Text`
  color: #05375a;
  font-size: 18px;
`;

export const Action = styled.View`
  flex-direction: row;
  margin-top: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #f2f2f2;
  padding-bottom: 5px;
`;

export const TextInput = styled.TextInput`
  flex: 1;
  margin-top: ${Platform.OS === 'ios' ? '0px' : '-12px'};
  padding-left: 10px;
  color: #05375a;
`;

export const SignInButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

export const TextSign = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const ErrorMessage = styled.Text`
  color: red;
  font-weight: bold;
  font-size: 13px;
  margin-top: 5px;
`;
