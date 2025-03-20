import React, { useCallback, useState, useEffect } from "react";
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
  FlatList,
  Alert,
} from "react-native";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
const UserProfile = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  const getUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.get(`/users/me`, {
        headers: { Authorization: "Bearer${token}" },
      });
      setUserData(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Une erreur est survenue");
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [getUserData])
  );

  const handleEditProfile = () => {
    router.push("../edit");
  };

  const handleLogout = () => {
    console.log("Déconnexion");
    router.push("/screens/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headercontainer}>
        <Text style={styles.profileText}>Mon profil</Text>
      </View>

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <View style={styles.profileview}>
          <Image
            style={styles.profileImage}
            source={require("@/assets/images/profil.png")}
          />
        </View>
      </View>
      <View style={styles.infocontainer}>
        <Text style={styles.usernametext}>
          {userData
            ? `${userData.firstName} ${userData.lastName}`
            : "Chargement..."}
        </Text>
        <Text>{userData?.role || "Rôle inconnu"}</Text>
        <Text>{userData?.email || "Email inconnu"}</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  headercontainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  profileview: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    width: 120,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#a00000",
  },
  profileview2: {
    height: 175,
    width: 175,
    borderRadius: 100,
    borderWidth: 3,
  },
  profileImage: {
    height: 175,
    width: 175,
    justifyContent: "center",
    alignItems: "center",
  },
  profileViewStyle: {
    backgroundColor: "#ff0aa1",
    height: 175,
    width: 175,
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  infocontainer: {
    alignItems: "center",
    marginTop: 40,
  },
  usernametext: {
    textAlign: "center",
    fontSize: 20,
    color: "#f0123f",
  },
});
