import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Api from "../api";

function SignupPage() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    name: "",
    pseudo: "",
    file: "",
  });
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleChange = (id, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleFileChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("ImagePicker result:", result); // Log the entire result

    if (!result.canceled) {
      // Access the URI from the first asset
      const uri = result.assets[0].uri;
      console.log("Selected file URI:", uri); // Log the URI

      setFormState((prevState) => ({
        ...prevState,
        file: uri,
      }));
    } else {
      console.log("Image selection was cancelled.");
    }
  };

  const handleSubmit = async () => {
    try {
      const { email, password, name, pseudo, file } = formState;
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      formData.append("pseudo", pseudo);
      if (file) {
        formData.append("avatar", {
          uri: file,
          type: "image/jpeg",
          name: "avatar.jpg",
        });
      }

      console.log("Sending signup request...");
      const response = await Api.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response received:", response);

      if (response.status === 201) {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      setError(error.response?.data?.message || "An error occurred.");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign up for your account</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={formState.email}
          onChangeText={(value) => handleChange("email", value)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formState.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formState.name}
          onChangeText={(value) => handleChange("name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Pseudo"
          value={formState.pseudo}
          onChangeText={(value) => handleChange("pseudo", value)}
        />
        <TouchableOpacity style={styles.fileButton} onPress={handleFileChange}>
          <Text style={styles.fileButtonText}>Choose Avatar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            Log in
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
  },
  fileButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  fileButtonText: {
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 6,
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    marginTop: 20,
  },
  loginLink: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
});

export default SignupPage;
