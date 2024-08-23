import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Api from "../api";

const OnePlacePage = () => {
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { markerId } = route.params;

  useEffect(() => {
    fetchPlaceDetails();
  }, []);

  const fetchPlaceDetails = async () => {
    try {
      const response = await Api.get(`/places/${markerId}`);
      setPlaceDetails(response.data);
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!placeDetails) {
    return (
      <View style={styles.container}>
        <Text>No details available for this place.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{placeDetails.name}</Text>
      {placeDetails.photo && (
        <Image source={{ uri: placeDetails.photo }} style={styles.image} />
      )}
      <Text style={styles.description}>{placeDetails.description}</Text>
      <Text style={styles.address}>Address: {placeDetails.address}</Text>
      {/* Add more details as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
});

export default OnePlacePage;
