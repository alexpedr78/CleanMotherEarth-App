import React, { useEffect } from "react";
import { View, Button } from "react-native";
import { useAuth } from "../context/AuthContextWrapper.js";
import { useNavigation } from "@react-navigation/native";

function LogoutComponent() {
  const { isLoggedIn, logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate("Login");
    }
  }, [isLoggedIn, navigation]);

  if (!isLoggedIn) {
    return null; // Prevent rendering if not logged in
  }

  return (
    <View>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

export default LogoutComponent;
