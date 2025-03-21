import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "@/routes/api";

interface UserUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  address?: string;
}

const EditProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (updatedFields: UserUpdate) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Erreur", "Vous n'êtes pas connectés");
        return;
      }
      console.log("Données envoyées:", updatedFields);

      await api.put("/users/me", updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Succès", "Informations mises à jour !");
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour");
      console.error("Erreur de mise à jour:", error);
    }
  };

  if (loading) return <Text>Chargement...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.titlecontainer}>
        <Text style={styles.title}>Modifier votre profil</Text>
      </View>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={user.firstName}
          onChangeText={(text) => setUser({ ...user, firstName: text })}
          placeholder="Prénom"
        />
        <TextInput
          style={styles.input}
          value={user.lastName}
          onChangeText={(text) => setUser({ ...user, lastName: text })}
          placeholder="Nom"
        />
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={user.role}
          onChangeText={(text) => setUser({ ...user, role: text })}
          placeholder="Rôle"
        />
        <TextInput
          style={styles.input}
          value={user.phone}
          onChangeText={(text) => setUser({ ...user, phone: text })}
          placeholder="Téléphone"
        />
        <TextInput
          style={styles.input}
          value={user.address}
          onChangeText={(text) => setUser({ ...user, address: text })}
          placeholder="Adresse"
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleUpdate(user)}
      >
        <Text style={styles.buttonText}>Mettre à jour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titlecontainer: {
    /*backgroundColor: "#4C88FF",
    padding: 20,*/
  },
  title: {
    color: "white",
    backgroundColor: "#4c88ff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    padding: 20,
    width: "100%",
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#d81b60",
  },
  input: {
    height: 40,
    borderColor: "#D81B60",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  button: {
    backgroundColor: "#4c88ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});

export default EditProfile;
