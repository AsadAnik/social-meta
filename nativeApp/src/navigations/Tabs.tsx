import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Ionicons, AntDesign } from '@expo/vector-icons';
// import HomeDrawer from './HomeDrawer';


// import HomeScreen from './Home';
import { ProfileScreen, PostScreen, ChatTabScreen,MessageScreen, ExploreScreen, HomeScreen } from '../screens';

// const HomeStack = createNativeStackNavigator();
// const ProfileStack = createNativeStackNavigator();
// const PostStack = createNativeStackNavigator();
// const SettingStack = createNativeStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="white"
        >
            {/* <Tab.Screen
        name="HomeDrawer"
        component={HomeDrawer}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-home" size={24} color={color} />
          )
        }}
      /> */}

            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Search',
                    //   tabBarIcon: ({ color }) => (
                    //     <AntDesign name="search1" size={24} color={color} />
                    //   )
                }}
            />

            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarLabel: 'Search',
                    //   tabBarIcon: ({ color }) => (
                    //     <AntDesign name="search1" size={24} color={color} />
                    //   )
                }}
            />

            <Tab.Screen
                name="Post"
                component={PostScreen}
                options={{
                    tabBarLabel: 'Create Post',
                    //   tabBarIcon: ({ color }) => (
                    //     <AntDesign name="pluscircle" size={24} color={color} />
                    //   )
                }}
            />
           
             <Tab.Screen
                name="Chat"
                component={ChatTabScreen}
                options={{
                    tabBarLabel: 'Chat',
                    headerShown: true,
                    //   tabBarIcon: ({ color }) => (
                    //     <AntDesign name="wechat" size={24} color={color} />
                    //   )
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    //   tabBarIcon: ({ color }) => (
                    //     <AntDesign name="profile" size={24} color={color} />
                    //   ),
                }}
            />
        </Tab.Navigator>
    );
};


// Profile Stack Navigator Screen..
// const ProfileStackScreen = ({ navigation }) => (
//   <ProfileStack.Navigator screenOptions={{
//     headerStyle: {
//       backgroundColor: 'royalblue'
//     },
//     headerTintColor: 'white',
//     headerTintStyle: {
//       fontWeight: 'bold',
//     }
//   }}>
//     <ProfileStack.Screen
//       name="Profile"
//       component={ProfileScreen}
//       options={{
//         title: '',
//         headerRight: () => (
//           <MaterialCommunityIcons name="account-edit" size={24} color="white" />
//         )
//       }}
//     />
//   </ProfileStack.Navigator>
// );

// // Home Stack Navigator Screen..
// const HomeStackScreen = ({ navigation }) => (
//   <HomeStack.Navigator screenOptions={{
//     headerStyle: {
//       backgroundColor: 'orange'
//     },
//     headerTintColor: 'white',
//     headerTintStyle: {
//       fontWeight: 'bold'
//     }
//   }}>
//     <HomeStack.Screen
//       name="Home"
//       component={HomeScreen}
//       options={{
//         title: 'Hi All',
//         headerLeft: () => (
//           <Feather 
//             name="menu" 
//             size={24} 
//             color="white" 
//             onPress={() => navigation.openDrawer()}
//           />
//         )
//       }}
//     />
//   </HomeStack.Navigator>
// );

// // Post Stack Navigator Screen..
// const PostStackScreen = ({ navigation }) => (
//   <PostStack.Navigator screenOptions={{
//     headerStyle: {
//       backgroundColor: 'purple'
//     },
//     headerTintColor: 'white',
//     headerTintStyle: {
//       fontWeight: 'bold'
//     }
//   }}>
//     <PostStack.Screen 
//       name="Post2"
//       component={PostScreen}
//       options={{
//         title: 'Create Your Post'
//       }}
//     />
//   </PostStack.Navigator>
// );

// // Setting Stack Navigator Screen..
// const SettingStackScreen = ({ navigation }) => (
//   <SettingStack.Navigator>
//     <SettingStack.Screen
//       name="Settings2"
//       component={SettingScreen}
//     />
//   </SettingStack.Navigator>
// );



export default MainTabs;
