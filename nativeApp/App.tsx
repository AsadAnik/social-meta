import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  LoginScreen,
  MessageScreen,
  OnboardingScreen,
  PostScreen,
  RegisterScreen,
  RegisterScreen2,
  RegisterScreen3,
  SplashScreen,
  UploadProfileScreen,
} from './src/screens';
import {Tabs} from './src/navigations';
import ProfileScreen from './src/screens/tabs/ProfileScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home Screen',
          }}
        />
        <Stack.Screen
          name="Post"
          component={PostScreen}
          options={{
            title: 'Home Screen',
          }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Register2"
          component={RegisterScreen2}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Register3"
          component={RegisterScreen3}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="UploadProfile"
          component={UploadProfileScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Messages"
          component={MessageScreen}
          options={{
            headerShown: true,  
            //   tabBarIcon: ({ color }) => (
            //     <AntDesign name="wechat" size={24} color={color} />
            //   )
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
