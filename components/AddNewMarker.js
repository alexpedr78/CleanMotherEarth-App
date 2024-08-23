import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import Api from "../api";
import * as ImagePicker from "expo-image-picker";

function FormPlaceAppPage({ setShowForm, showForm, clickedPosition }) {
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    description: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoPick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const uri = result.assets[0].uri;
      console.log("Selected file URI:", uri); // Log the URI

      setFormData({
        ...formData,
        photo: uri,
      });
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !clickedPosition.latitude ||
      !clickedPosition.longitude ||
      !formData.photo
    ) {
      Alert.alert(
        "Please fill in all fields and select a location on the map."
      );
      return;
    }
    let newPosition = {
      lat: clickedPosition.latitude,
      long: clickedPosition.longitude,
    };
    let formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("position", JSON.stringify(newPosition));
    formDataToSend.append("description", formData.description);

    if (formData.photo) {
      formDataToSend.append("photo", {
        uri: formData.photo,
        type: "image/jpeg",
        name: "photo.jpg",
      });
    }
    console.log(formDataToSend);
    try {
      const response = await Api.post("/garbagesPlaces", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({
        name: "",
        photo: null,
        description: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      {!showForm ? (
        <View>
          <Button
            title="Help us find new places"
            onPress={() => setShowForm(true)}
            color="#2196F3"
          />
          <Text style={styles.instructions}>
            Select a location by clicking on the map. Check the Markers to
            Create an Event.
          </Text>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.instructions}>
            Select a location by clicking on the map{" "}
            {clickedPosition.lat && clickedPosition.long ? (
              <Image
                source={require("../assets/verified.png")}
                style={styles.icon}
              />
            ) : null}
          </Text>

          <TextInput
            placeholder="Enter name"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            style={styles.input}
          />

          <Button title="Pick a photo" onPress={handlePhotoPick} />

          <TextInput
            placeholder="Enter description"
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
            style={styles.input}
            multiline
          />

          <Button title="Create Place" onPress={handleSubmit} color="#2196F3" />
          <Button
            title="Cancel"
            onPress={() => setShowForm(false)}
            color="#F44336"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
  },
  instructions: {
    marginVertical: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  form: {
    marginTop: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default FormPlaceAppPage;
