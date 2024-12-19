import styled from 'styled-components/native';

// Define the container styled component
export const Container = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 100px;
  align-items: center;
  background-color: #ffffff;
`;

// Define the card styled component
export const Card = styled.TouchableOpacity`
  width: 100%;
`;

// Define the user info container styled component
export const UserInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

// Define the user image wrapper styled component
export const UserImgWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
`;

// Define the user image styled component
export const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

// Define the text section styled component
export const TextSection = styled.View`
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-left: 0;
  margin-left: 10px;
  width: 300px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;

// Define the user info text container styled component
export const UserInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

// Define the user name styled component
export const UserName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  font-family: 'Lato-Regular';
`;

// Define the post time styled component
export const PostTime = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Lato-Regular';
`;

// Define the message text styled component
export const MessageText = styled.Text`
  font-size: 14px;
  color: #333333;
`;
