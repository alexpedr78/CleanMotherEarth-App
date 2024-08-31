import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";

const OneEventPage = ({ navigation }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [placeAbout, setPlaceAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const route = useRoute();
  const { markerId } = route.params;

  useEffect(() => {
    fetchEventDetails();
    fetchUserId();
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log("Current User:", currentUser);
    }
  }, [currentUser]);

  const fetchUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("currentUser");
      if (userId) {
        setCurrentUser(userId);
        console.log(currentUser);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchEventDetails = async () => {
    try {
      const response = await Api.get(`/events/${markerId}`);
      const eventData = response.data;
      setEventDetails(eventData);
      console.log("datafromtheevent:", eventData);
      if (eventData !== null && eventData.place) {
        const response2 = await Api.get(`/garbagesPlaces/${eventData.place}`);
        console.log("place details:", response2.data);
        setPlaceAbout(response2.data);
      } else {
        console.error("Event data does not contain place information.");
      }
    } catch (error) {
      console.error("Error fetching event or place details:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!eventDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDetailsText}>
          No details available for this place.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.eventBox}>
        <Text style={styles.title}>{eventDetails.name}</Text>
        {eventDetails.photo && (
          <Image source={{ uri: eventDetails.photo }} style={styles.image} />
        )}
        <Text style={styles.description}>{eventDetails.description}</Text>
        <Text style={styles.address}>Address: {eventDetails.address}</Text>
      </View>
      <Text>This Event is about this place: </Text>
      <TouchableOpacity
        style={styles.eventBox}
        onPress={() =>
          navigation.navigate("OnePlacePage", { markerId: placeAbout._id })
        }
      >
        <Text>{placeAbout !== null ? placeAbout.name : ""}</Text>
        {placeAbout.photo && (
          <Image source={{ uri: placeAbout.photo }} style={styles.image2} />
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    marginBottom: 15,
    borderRadius: 15,
  },
  image2: {
    width: "50%",
    height: 150,
    resizeMode: "cover",
    marginBottom: 15,
    borderRadius: 15,
  },

  description: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  eventText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  noDetailsText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
  },
  eventBox: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  eventPosition: {
    fontSize: 16,
    color: "#666",
  },
  eventDescription: {
    fontSize: 14,
    color: "#777",
  },
});

export default OneEventPage;
