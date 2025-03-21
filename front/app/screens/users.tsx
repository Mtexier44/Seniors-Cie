import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../routes/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetchUsers();
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) => user.firstName?.toLowerCase().includes(query) || false
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const getCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentUserId(response.data._id);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur courant:",
        error
      );
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token manquant");
      }

      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      Alert.alert("Erreur", "Impossible de charger la liste des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const startChat = (user: User) => {
    router.push({
      pathname: "/screens/chat",
      params: {
        receiverId: user._id,
        receiverName: user.firstName,
      },
    });
  };

  const getRoleText = (role: string) => {
    return role === "etudiant" ? "Étudiant" : "Senior";
  };

  const getRoleColor = (role: string) => {
    return role === "etudiant" ? "#4caf50" : "#ff9800";
  };

  const renderItem = ({ item }: { item: User }) => {
    // Ne pas afficher l'utilisateur courant
    if (item._id === currentUserId) {
      return null;
    }

    // Ajouter une vérification pour s'assurer que item.name existe
    const firstLetter = item.firstName
      ? item.firstName.charAt(0).toUpperCase()
      : "?";

    return (
      <TouchableOpacity style={styles.userCard} onPress={() => startChat(item)}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.avatarText}>{firstLetter}</Text>
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.firstName && item.lastName
              ? `${item.firstName} ${item.lastName}`
              : "Sans nom"}
          </Text>
          <Text style={styles.userEmail}>{item.email || "Sans email"}</Text>
          <View
            style={[
              styles.roleTag,
              { backgroundColor: getRoleColor(item.role) },
            ]}
          >
            <Text style={styles.roleText}>{getRoleText(item.role)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Utilisateurs</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchUsers}>
          <Text style={styles.refreshButtonText}>Actualiser</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  refreshButton: {
    backgroundColor: "#D81B60",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listContainer: {
    paddingBottom: 16,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderAvatar: {
    backgroundColor: "#D81B60",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  roleTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
