// LoginPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Api from "../api";
import { useAuth } from "../context/AuthContextWrapper.js";

function LoginPage() {
  const [formState, setFormState] = useState({ pseudo: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation();

  function handleChange(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function handleSubmit() {
    try {
      console.log("Submitting login form:", formState);
      const success = await login(formState.pseudo, formState.password);
      if (success) {
        console.log("Login successful, navigating to Map");
        navigation.navigate("Map");
      } else {
        console.log("Login failed, invalid credentials");
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login.");
    }
  }

  const { password, pseudo } = formState;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Log in to your account</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Pseudo"
            value={pseudo}
            onChangeText={(value) => handleChange("pseudo", value)}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.linkText}>Need an account? Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 20,
  },
  section: {
    width: "100%",
    maxWidth: 400,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  link: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  linkText: {
    color: "#4f46e5",
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LoginPage;
