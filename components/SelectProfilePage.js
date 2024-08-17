import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import Api from "../api";
import DropDownPicker from "react-native-dropdown-picker";

const SelectProfilePage = ({ setSelect, select }) => {
  const [dataActivity, setDataActivity] = useState([]);
  const [update, setUpdate] = useState(false);
  const [showComing, setShowComing] = useState(false);
  const [formTrigger, setFormTrigger] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
  });
  const [peopleComing, setPeopleComing] = useState({});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(select);
  const [items, setItems] = useState([
    { label: "Check Your Activity", value: null },
    { label: "See all the Events You Joined", value: "event" },
    { label: "See all the Events You Created", value: "events" },
    { label: "See all the Place To Clean that You Discovered", value: "place" },
  ]);

  useEffect(() => {
    fetchTheRightActivity();
  }, [select, update]);

  const fetchTheRightActivity = async () => {
    try {
      const URLMap = {
        event: "joining/yourEvents",
        events: "events",
        place: "garbagesPlaces/yourPlaces",
      };
      const URL = URLMap[select] || "";
      if (URL) {
        const response = await Api.get(`/${URL}`);
        setDataActivity(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectChange = (itemValue) => {
    setSelect(itemValue);
    setValue(itemValue);
  };

  const handleEditToggle = () => setFormTrigger((prev) => !prev);

  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleFileChange = (file) => setFormData((prev) => ({ ...prev, file }));

  const handleSubmit = async (id, event) => {
    event.preventDefault();
    try {
      const formDataWithFile = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        formDataWithFile.append(key, value)
      );

      const response = await Api.put(
        `/${select === "place" ? "garbagesPlaces" : "events"}/${id}`,
        formDataWithFile,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUpdate((prev) => !prev);
      setFormTrigger(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePeopleComing = async (eventId) => {
    try {
      const response = await Api.get(`/joining/${eventId}`);
      setPeopleComing((prev) => ({ ...prev, [eventId]: response.data }));
      setShowComing((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Api.delete(
        `/${
          select === "place"
            ? "garbagesPlaces"
            : select === "events"
            ? "events"
            : "joining"
        }/${id}`
      );
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.name || item.eventId?.name || "Title: "}
      </Text>
      <Text>
        {item.timeStart ? `Starting time: ${formatDate(item.timeStart)}` : null}
      </Text>
      <Text>
        {item.createdAt ? `Found the: ${formatDate(item.createdAt)}` : null}
      </Text>
      {item.eventId?.photo && (
        <Image source={{ uri: item.eventId.photo }} style={styles.image} />
      )}
      {item.photo && (
        <Image source={{ uri: item.photo }} style={styles.image} />
      )}
      <Text>
        {(select === "place" || select === "events") && item.description
          ? `Description: ${item.description}`
          : "No description"}
      </Text>
      {select === "events" && (
        <Button
          title="People Coming"
          onPress={() => handlePeopleComing(item._id)}
        />
      )}
      {showComing && (
        <View>
          <Text>People coming to this Event:</Text>
          {peopleComing[item._id]?.map((person) => (
            <Text key={person._id}>{person.creator.name}</Text>
          )) || <Text>No Attendees</Text>}
        </View>
      )}
      <Button title="Delete" onPress={() => handleDelete(item._id)} />
      {formTrigger && (
        <View style={styles.form}>
          <TextInput
            placeholder="Name"
            onChangeText={(text) => handleChange("name", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            onChangeText={(text) => handleChange("description", text)}
            style={styles.input}
          />
          <Button
            title="Upload File"
            onPress={() =>
              Alert.alert("File Upload", "Use a file picker to select a file")
            }
          />
          <Button
            title="Submit"
            onPress={(event) => handleSubmit(item._id, event)}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={handleSelectChange}
        setItems={setItems}
        style={styles.picker}
        dropDownContainerStyle={styles.dropdownContainer}
      />
      <FlatList
        data={dataActivity}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text>No activity data available for now... Pick a filter...</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  picker: { marginBottom: 16 },
  dropdownContainer: { backgroundColor: "#fafafa" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 8 },
  form: { marginTop: 16 },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default SelectProfilePage;
