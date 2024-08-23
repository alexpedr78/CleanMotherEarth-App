import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Api = axios.create({
  baseURL: "http://192.168.1.14:5008/api",
});

Api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
);

export default Api;
