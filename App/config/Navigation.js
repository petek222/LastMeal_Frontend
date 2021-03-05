import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Profile from '../screens/Profile';
import Pantry from '../screens/Pantry';
import Recipes from '../screens/Recipes';
import Options from '../screens/Options';

const MainStack = createStackNavigator();
const MainStackScreen = () => (
    <MainStack.Navigator
        // headerMode='none'
        // initialRouteName="Options"
        >
        <MainStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <MainStack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <MainStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <MainStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <MainStack.Screen name="Pantry" component={Pantry} options={{ headerShown: false }} />
        <MainStack.Screen name="Recipes" component={Recipes} options={{ headerShown: false }} />
        <MainStack.Screen name="Options" component={Options} />

    </MainStack.Navigator>
);

export default () => (
    <NavigationContainer>
        <MainStackScreen />
    </NavigationContainer>
)