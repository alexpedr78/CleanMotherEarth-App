import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

function GoToOnePlaceButton({ markerId }) {
  console.log("Received markerId:", markerId);
  const navigation = useNavigation();

  const handleAddAnEvent = () => {
    console.log("Navigating to OnePlacePage with markerId:", markerId);
    navigation.navigate("OnePlacePage", { markerId });
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        console.log("Button pressed");
        handleAddAnEvent();
      }}
    >
      <Text style={styles.buttonText}>Show this Place to add an Event</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default GoToOnePlaceButton;
