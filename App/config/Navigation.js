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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


// const MainStack = createStackNavigator();

const Tab = createBottomTabNavigator()
const LoginStack = createStackNavigator();
const SignupStack = createStackNavigator();

function LoginStackScreen() {
    return (
        <LoginStack.Navigator>
            <LoginStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </LoginStack.Navigator>
    );
}

function SignupStackScreen() {
    return (
        <SignupStack.Navigator>
            <SignupStack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        </SignupStack.Navigator>
    );
}


export default () => (
    <NavigationContainer>
        <Tab.Navigator
         screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Options') {
              iconName = focused
              ? 'ios-cog'
              : 'ios-cog-outline';
            }
            else if (route.name === 'Login') {
                iconName = focused
                ? 'ios-log-in'
                : 'ios-log-in-outline';            
            }
            else if (route.name === "Signup") {
                iconName = focused
                ? 'ios-create'
                : 'ios-create-outline'; 
            }
            else if (route.name === 'Profile') {
                iconName = focused
                ? 'ios-person'
                : 'ios-person-outline';             }
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
      return <Ionicons name={iconName} size={size} color={color}     />;
         },
      })}
      tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      }}
        >
            <Tab.Screen name="Login" component={LoginStackScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Signup" component={SignupStackScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Tab.Screen name="Pantry" component={Pantry} options={{ headerShown: false }} />
            <Tab.Screen name="Recipes" component={Recipes} options={{ headerShown: false }} />
            <Tab.Screen name="Options" component={Options} />
        </Tab.Navigator>
    </NavigationContainer>
)