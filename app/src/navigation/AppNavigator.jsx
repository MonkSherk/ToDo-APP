import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }} // скрыть заголовок на экране Login
            />
            <Stack.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{ headerShown: false }} // скрыть заголовок на экране Registration
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }} // скрыть заголовок на экране Home
            />
            <Stack.Screen
                name="Tasks"
                component={TasksScreen}
                options={{ headerShown: false }} // скрыть заголовок на экране Tasks
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false }} // скрыть заголовок на экране Profile
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
