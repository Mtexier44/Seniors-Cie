import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
//import GenericCard from "../../components/AuthCard";

import api from "../../routes/api";

const RegisterScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !role) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs!");
      return;
      setIsLoading(true);
    }
    try {
      const response = await api.post("/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        role,
      });

      if (response.status === 201) {
        Alert.alert(
          "Inscription réussie",
          "Votre compte a été créé avec succèes"
        );
      }
      console.log("Utilisateur enregistré avec succès:", response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur", "Une erreur est survenu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView>
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Image
              source={require("@/assets/images/gerologo.png")}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <Text style={styles.title}>S'inscrire</Text>
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              placeholderTextColor={"#aaa"}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor={"#aaa"}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={"#aaa"}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={"#aaa"}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Picker
              style={styles.input}
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="Sélectionnez un rôle" value="" />
              <Picker.Item label="Étudiant" value="etudiant" />
              <Picker.Item label="Sénior" value="senior" />
            </Picker>

            <TouchableOpacity onPress={handleRegister} style={styles.button}>
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

            <Text style={styles.link}>
              Déjà un compte?{" "}
              <TouchableOpacity onPress={() => router.push("/screens/login")}>
                <Text style={{ fontWeight: "bold" }}> Se connecter</Text>
              </TouchableOpacity>
            </Text>
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
    width: "100%",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
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
  link: {
    color: "#D81B60",
    marginTop: 10,
    textAlign: "center",
  },
});

export default RegisterScreen;
