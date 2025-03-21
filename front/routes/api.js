import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000/api",
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    console.log("Requête envoyée à:", config.url);
    return config;
  },
  (error) => {
    console.log("Erreur avant envoi de la requête:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Réponse reçue:", response.status);
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.log("Timeout de la requête - le serveur ne répond pas");
    } else if (error.response) {
      console.log("Erreur avec réponse:", error.response.status);
    } else if (error.request) {
      console.log("Requête envoyée mais pas de réponse reçue");
    } else {
      console.log(
        "Erreur lors de la configuration de la requête:",
        error.message
      );
    }
    return Promise.reject(error);
  }
);
export default api;
