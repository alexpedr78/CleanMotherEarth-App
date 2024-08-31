import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";
import Api from "../api";
import { Picker } from "@react-native-picker/picker";

function DashboardPage() {
  const [infosToDisplay, setInfosToDisplay] = useState(null);
  const [value, setValue] = useState("");
  const [reload, setReload] = useState(false);

  async function fetchInfos() {
    try {
      let URL;
      if (value === "user") {
        URL = "users/admin";
      } else if (value === "place") {
        URL = "garbagesPlaces/";
      } else if (value === "event") {
        URL = "events/admin";
      }
      if (URL) {
        const response = await Api.get(`/${URL}`);
        setInfosToDisplay(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchInfos();
  }, [value, reload]);

  async function handleDelete(id) {
    try {
      let URL;
      if (value === "user") URL = `users/${id}`;
      else if (value === "place") {
        URL = `garbagesPlaces/${id}`;
      } else if (value === "event") {
        URL = `events/${id}`;
      }
      if (URL) {
        await Api.delete(`/${URL}`);
      }
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => setValue(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Choose" value="" />
          <Picker.Item label="See all Users" value="user" />
          <Picker.Item label="See all Places" value="place" />
          <Picker.Item label="See all Events" value="event" />
        </Picker>
      </View>
      {infosToDisplay && value ? (
        infosToDisplay.map((elem) => (
          <View key={elem._id} style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{elem.name}</Text>
            {elem.photo && (
              <Image source={{ uri: elem.photo }} style={styles.image} />
            )}
            {elem.avatar && (
              <Image source={{ uri: elem.avatar }} style={styles.image} />
            )}
            <Button
              title="Delete"
              color="#4A90E2"
              onPress={() => handleDelete(elem._id)}
            />
          </View>
        ))
      ) : (
        <Text style={styles.noFilterText}>Pick A Filter</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  infoContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 8,
  },
  noFilterText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});

export default DashboardPage;
