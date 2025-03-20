import axios from "axios";

const api = axios.create({
  baseURL: "http://10.44.17.220:3000/api",
});

export default api;

/*import { Platform } from "react-native";
import axios from "axios";
const getApiUrl = () => {
  if (Platform.OS === "android") {
    return __DEV__
      ? "http://10.0.2.2:3000/api" // Pour l'émulateur Android
      : "http://192.168.56.1:3000/api"; // Pour l'appareil physique (remplacez par votre adresse IP locale)
  }
  return "http://localhost:3000/api"; // Pour iOS
};

const api = axios.create({
  baseURL: getApiUrl(),
});

export default api;*/
