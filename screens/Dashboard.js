import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

function Dashboard() {
  const [message, setMessage] = useState("Hello");

  useEffect(() => {
    // Example effect: Update the message after 3 seconds
    const timer = setTimeout(() => {
      setMessage("Welcome to the Dashboard!");
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Dashboard;
