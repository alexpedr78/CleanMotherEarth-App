import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Api from "../api";
import * as ImagePicker from "expo-image-picker";

function UpdateProfilButton({
  reloadInfos,
  updateForm,
  setReloadInfos,
  userDetail,
  setUpdateForm,
}) {
  const [formState, setFormState] = useState({
    email: userDetail.email,
    name: userDetail.name,
    pseudo: userDetail.pseudo,
    file: userDetail.avatar,
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFormState((prevState) => ({
        ...prevState,
        file: result.uri,
      }));
    }
  };

  const handleCancel = () => {
    setUpdateForm(!updateForm);
  };

  const handleSubmit = async () => {
    try {
      let formData = new FormData();
      formData.append("email", formState.email);
      formData.append("name", formState.name);
      formData.append("pseudo", formState.pseudo);
      if (formState.file) {
        formData.append("avatar", {
          uri: formState.file,
          type: "image/jpeg",
          name: "avatar.jpg",
        });
      }

      const response = await Api.put("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response received:", response);
      if (response.status === 200 || response.status === 201) {
        navigation.navigate("User");
        setUpdateForm(!updateForm);
        setReloadInfos(!reloadInfos);
      }
    } catch (error) {
      console.error("Update error:", error.message);
      console.error("Error details:", error.response?.data);
      setError(error.response?.data?.message || "An error occurred.");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  const { email, name, pseudo, file } = formState;

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Update your account</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={(value) => handleChange("email", value)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(value) => handleChange("name", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Pseudo"
          value={pseudo}
          onChangeText={(value) => handleChange("pseudo", value)}
        />
        <TouchableOpacity style={styles.fileButton} onPress={handleFileChange}>
          <Text style={styles.fileButtonText}>Choose Avatar</Text>
        </TouchableOpacity>
        {file && <Image source={{ uri: file }} style={styles.avatar} />}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update your Infos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#8B5CF6",
    padding: 10,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default UpdateProfilButton;
