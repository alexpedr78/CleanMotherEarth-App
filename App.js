import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapPage from './screens/Map.js';
import LoginPage from './screens/Login.js';
import { AuthProvider } from './context/AuthContextWrapper.js';
import ProfilePage from './screens/User.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Map" component={MapPage} options={{ headerShown: false }} />
          <Stack.Screen name="User" component={ProfilePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
