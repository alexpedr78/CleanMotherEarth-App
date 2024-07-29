import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserPage from './screens/User.js';
import MapPage from './screens/Map.js'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="User">
        <Stack.Screen name="User" component={UserPage} />
        <Stack.Screen name="Map" component={MapPage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}