import React, { useState, useEffect } from 'react';
import { View, Text, Picker, FlatList, StyleSheet } from 'react-native';

const SortByDate = ({ dataActivity, setDataActivity }) => {
  const [valueSorting, setValueSorting] = useState('');

  const handleSelect = (itemValue) => {
    setValueSorting(itemValue);
  };

  const sortDataByDate = () => {
    if (valueSorting === 'new' && dataActivity) {
      const newData = dataActivity
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDataActivity(newData);
    } else if (valueSorting === 'old' && dataActivity) {
      const newData = dataActivity
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setDataActivity(newData);
    }
  };

  useEffect(() => {
    sortDataByDate();
  }, [valueSorting]);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text>{item.createdAt}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={valueSorting}
        style={styles.picker}
        onValueChange={handleSelect}
      >
        <Picker.Item label="Select An Option" value="" />
        <Picker.Item label="Sort By the Oldest" value="old" />
        <Picker.Item label="Sort By the Newest" value="new" />
      </Picker>
      <FlatList
        data={dataActivity}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  list: {
    marginTop: 16,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default SortByDate;
