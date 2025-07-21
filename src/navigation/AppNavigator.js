import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FindUserIdScreen from '../screens/FindUserIdScreen';
import HomeScreen from '../screens/HomeScreen';
import PasswordFindScreen from '../screens/PasswordFindScreen';

import TabNavigator from './TabNavigator';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="FindUserId" component={FindUserIdScreen} />
        <Stack.Screen name="MainTab" component={TabNavigator} />
        <Stack.Screen name="ForgotPassword" component={PasswordFindScreen} />
         <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}