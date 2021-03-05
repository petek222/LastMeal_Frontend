import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Profile from '../screens/Profile';
import Pantry from '../screens/Pantry';
import Recipes from '../screens/Recipes';
import Options from '../screens/Options';

// custom_styling = {
//     fontSize: 20
// }

const Tab = createBottomTabNavigator();

const MainStack = createStackNavigator();
const MainStackScreen = () => (
    <Tab.Navigator
        // headerMode='none'
        // initialRouteName="Profile"
        >
        <Tab.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Tab.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Tab.Screen name="Pantry" component={Pantry} options={{ headerShown: false }} />
        <Tab.Screen name="Recipes" component={Recipes} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Tab.Screen name="Options" component={Options} />

    </Tab.Navigator>
);

export default () => (
    <NavigationContainer>
        <MainStackScreen />
    </NavigationContainer>
)