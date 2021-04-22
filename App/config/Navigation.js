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
import AddItem from '../screens/AddItem';
import RecipeInfo from '../screens/RecipeInfo';
import ResetPassword from '../screens/ResetPassword';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator();

function ProfileTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused
                            ? 'ios-home'
                            : 'ios-home-outline';
                    } else if (route.name === 'Options') {
                        iconName = focused
                            ? 'ios-cog'
                            : 'ios-cog-outline';
                    }
                    // to remove
                    else if (route.name === 'Login') {
                        iconName = focused
                            ? 'ios-log-in'
                            : 'ios-log-in-outline';
                    }
                    // to remove
                    else if (route.name === "Signup") {
                        iconName = focused
                            ? 'ios-create'
                            : 'ios-create-outline';
                    }
                    else if (route.name === 'Profile') {
                        iconName = focused
                            ? 'ios-person'
                            : 'ios-person-outline';
                    }
                    else if (route.name === 'Pantry') {
                        iconName = focused
                            ? 'ios-list'
                            : 'ios-list-outline';
                    }
                    else if (route.name === 'Recipes') {
                        iconName = focused
                            ? 'ios-pizza'
                            : 'ios-pizza-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >

            <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Tab.Screen name="Pantry" component={Pantry} options={{ headerShown: false }} />
            <Tab.Screen name="Recipes" component={Recipes} options={{ headerShown: false }} />
            <Tab.Screen name="Options" component={Options} />
        </Tab.Navigator>
    );
}

// dark theme
const MyDark = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black',
        background: '#222',
        text: 'white',
    },
};

// light theme
const MyLight = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'white'
    },
};

// stores state of dark mode
export const darkState = atom({
    key: 'darkState', // unique ID
    default: false, // initial value
});

const Navigation = () => {
    return (
        <NavigationContainer theme={useRecoilValue(darkState) ? MyDark : MyLight}>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Profile" component={ProfileTabs} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
                <Stack.Screen name="AddItem" component={AddItem} options={{ headerShown: false }} />
                <Stack.Screen name="RecipeInfo" component={RecipeInfo} options={{ headerShown: false }} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default () => (
    <RecoilRoot>
        <Navigation />
    </RecoilRoot>
)