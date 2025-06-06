/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  ChatScreen,
  LoginScreen,
  MessageScreen,
  OnboardingScreen,
  RegisterScreen,
  RegisterScreen2,
  RegisterScreen3,
  SplashScreen,
  UploadProfileScreen,
} from './src/screens';
import { Tabs } from './src/navigations/index';
import Entypo from 'react-native-vector-icons/Entypo';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import Toast from 'react-native-toast-message';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

const App = () => {
  /**
   * CUSTOM HEADERS TITLE FOR BOTTOM TABS
   * @param route
   * @returns
   */
  // region Dynamic Title for Tabs
  const getHeaderTitle = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    const titleMap: { [key: string]: string } = {
      Home: 'Home',
      Profile: 'Profile',
      Explore: 'Explore',
      Notification: 'Notifications',
      Post: 'Create Post',
      Messages: 'Messages',
    };

    return titleMap[routeName as keyof typeof titleMap] || routeName;
  };

  // region Navigations
  return (
    <Provider store={store}>
      <PaperProvider>
        <GestureHandlerRootView>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Onboarding">
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{
                  headerShown: false,
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

              {/* TAB SCREENS */}
              <Stack.Screen
                name="Tabs"
                component={Tabs}
                options={({ route, navigation }: any) => {
                  const focusedRouteName = getFocusedRouteNameFromRoute(route) ?? 'Home';
                  return {
                    headerShown: true,
                    headerTitle: getHeaderTitle(route) || 'Home',
                    headerRight: () =>
                      focusedRouteName === 'Home' ? (
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Chat')}>
                          <Entypo
                            name="chat"
                            size={24}
                            color="#A4C400"
                            style={{ marginRight: 15 }}
                          />
                        </TouchableOpacity>
                      ) : null,
                  };
                }}
              />

              <Stack.Screen
                name="Messages"
                component={MessageScreen}
                options={{
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                  headerShown: true,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast />
        </GestureHandlerRootView>
      </PaperProvider>
    </Provider>
  );
};

export default App;
