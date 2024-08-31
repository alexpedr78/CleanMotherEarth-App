import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
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
    return null;
  }

  return (
    <View>
      <TouchableOpacity style={styles.button} title="Logout" onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3B82F6",
    padding: 11,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
  },
});

export default LogoutComponent;
