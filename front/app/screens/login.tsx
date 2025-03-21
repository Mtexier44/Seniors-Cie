import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Text,
  Button,
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../routes/api";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.status === 200 && response.data.token) {
        console.log("Connexion réussie, token", response.data.token);
        await AsyncStorage.setItem("token", response.data.token);
        router.push("/(tabs)/home");
      } else {
        throw new Error("Réponse inattendue du serveur");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert("Erreur", "Les informations de connexions sont incorrectes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Image
              source={require("@/assets/images/gerologo.png")}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <Text style={styles.title}>Se Connecter</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.button, isLoading && { opacity: 0.7 }]}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 30,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    /*color: "#D81B60",
    backgroundColor: "#F8BBD0",*/
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#D81B60",
    paddingVertical: 10,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LoginScreen;
