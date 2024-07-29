import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const UserPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Page</Text>
      <Button title="Go to Map" onPress={() => navigation.navigate('Map')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default UserPage;