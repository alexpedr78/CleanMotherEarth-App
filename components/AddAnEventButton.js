import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Api from "../api";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

function AddAnEvent({ setRefreshKey, placeInfos, markerId, currentUser }) {
  const navigation = useNavigation();
  const [addEventForm, setAddEventForm] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    avatar: null,
    description: "",
    timeStart: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleChange = (key, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [key]: value,
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
      const uri = result.assets[0].uri;
      console.log("Selected file URI:", uri);
      setFormState((prevState) => ({
        ...prevState,
        avatar: uri,
      }));
    }
  };

  const handleToggleForm = () => {
    setAddEventForm(!addEventForm);
  };

  const handleCancel = () => {
    setAddEventForm(!addEventForm);
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || formState.timeStart;
      setShowDatePicker(false);
      handleChange("timeStart", currentDate);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "set") {
      const currentDate = selectedTime || formState.timeStart;
      setShowTimePicker(false);
      handleChange("timeStart", currentDate);
    } else {
      setShowTimePicker(false);
    }
  };

  const handleSubmit = async () => {
    try {
      let formData = new FormData();
      formData.append("name", formState.name);
      formData.append("position", JSON.stringify(placeInfos.position));
      formData.append("description", formState.description);
      formData.append("timeStart", formState.timeStart.toISOString());
      formData.append("creator", currentUser);
      formData.append("place", markerId);

      if (formState.avatar) {
        formData.append("photo", {
          uri: formState.avatar,
          type: "image/jpeg",
          name: "avatar.jpg",
        });
      }
      console.log("new event data", formData);
      const response = await Api.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAddEventForm(false);
      setFormState({
        name: "",
        avatar: null,
        description: "",
        timeStart: new Date(),
      });
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      Alert.alert("Error", "An error occurred while creating the event.");
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {!addEventForm ? (
        <TouchableOpacity style={styles.addButton} onPress={handleToggleForm}>
          <Text style={styles.buttonText}>Add an event about this place</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView>
          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formState.name}
              onChangeText={(value) => handleChange("name", value)}
              placeholder="Enter name"
            />
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>
                {formState.timeStart.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formState.timeStart}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateText}>
                {formState.timeStart.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={formState.timeStart}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
              />
            )}
            <Text style={styles.label}>Photo</Text>
            <TouchableOpacity
              onPress={handleFileChange}
              style={styles.fileButton}
            >
              <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>
            {formState.avatar && (
              <Image source={{ uri: formState.avatar }} style={styles.image} />
            )}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={formState.description}
              onChangeText={(value) => handleChange("description", value)}
              placeholder="Enter description"
              multiline
            />
            <Button
              title="Create an Event"
              onPress={handleSubmit}
              color="#4CAF50"
            />
            <Button title="Cancel" onPress={handleCancel} color="#F44336" />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  addButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  form: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    height: 100,
    backgroundColor: "white",
  },
  fileButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 15,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
});

export default AddAnEvent;
