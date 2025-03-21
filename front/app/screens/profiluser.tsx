import React, { useCallback, useState } from "react";
import api from "@/routes/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  address: string;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Erreur", "Vous n'êtes pas connecté");
        router.push("/screens/login");
        return;
      }

      const response = await api.get(`/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      Alert.alert("Erreur", "Impossible de récupérer vos informations");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [getUserData])
  );

  const handleEditProfile = () => {
    router.push("/screens/edit");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      console.log("Déconnexion réussie");
      router.push("/screens/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      Alert.alert("Erreur", "Impossible de vous déconnecter");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#D81B60" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.profileText}>Mon profil</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={require("@/assets/images/profil.png")}
            resizeMode="cover"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.usernameText}>
            {userData
              ? `${userData.firstName} ${userData.lastName}`
              : "Utilisateur inconnu"}
          </Text>
          <Text style={styles.roleText}>
            {userData?.role || "Rôle non renseigné"}
          </Text>
          <Text style={styles.emailText}>
            {userData?.email || "Email non renseignée"}
          </Text>
          <Text style={styles.emailText}>
            {userData?.phone || "Numéro non renseigné"}
          </Text>
          <Text style={styles.emailText}>
            {userData?.address || "Adresse non renseignée"}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>Modifier mon profil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
  },
  profileImageContainer: {
    /*height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#D81B60",
    overflow: "hidden",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",*/
  },
  profileImage: {
    height: 114,
    width: 114,
    borderRadius: 57,
  },
  infoContainer: {
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  usernameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  roleText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#888",
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#e91e63",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: "#ff6b6b",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfile;
