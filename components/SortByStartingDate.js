import React, { useState, useEffect } from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native';

const SortByStartingDate = ({ dataActivity, setDataActivity, select }) => {
  const [valueSorting, setValueSorting] = useState('');

  const handleSelect = (itemValue) => {
    setValueSorting(itemValue);
  };

  const sortDataByDate = () => {
    if (!dataActivity || dataActivity.length === 0 || select === null) {
      return;
    }

    let newData = dataActivity.slice();
    if ((valueSorting === 'close' || select === 'event') && select !== null) {
      newData.sort((a, b) => new Date(b.timeStart) - new Date(a.timeStart));
    }

    if ((valueSorting === 'far' || select === 'event') && select !== null) {
      newData.sort((a, b) => new Date(a.timeStart) - new Date(b.timeStart));
    }

    setDataActivity(newData);
  };

  useEffect(() => {
    sortDataByDate();
  }, [valueSorting]);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={valueSorting}
        style={styles.picker}
        onValueChange={handleSelect}
      >
        <Picker.Item label="Select An Option" value="" />
        <Picker.Item label="Sort By the closest Date" value="close" />
        <Picker.Item label="Sort By the farthest Date" value="far" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default SortByStartingDate;
