import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapPage from "./screens/Map.js";
import LoginPage from "./screens/Login.js";
import { AuthProvider, useAuth } from "./context/AuthContextWrapper.js";
import ProfilePage from "./screens/User.js";
import SignupPage from "./screens/Signup.js";
import DashboardPage from "./screens/Dashboard.js";
import OnePlacePage from "./screens/OnePlacePage.js";
import OneEventPage from "./screens/OneEventPage.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Map" : "Login"}>
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen
          name="Map"
          component={MapPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="User" component={ProfilePage} />
        <Stack.Screen name="Dashboard" component={DashboardPage} />
        <Stack.Screen name="OnePlacePage" component={OnePlacePage} />
        <Stack.Screen name="OneEventPage" component={OneEventPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
