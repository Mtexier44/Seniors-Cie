import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "@/routes/api";

const BubbleMessage = () => {
  const [unreadMessages, setUnreadMessages] = useState(0); // Nombre de messages non lus
  const router = useRouter();

  // Simuler la réception de messages non lus
  useEffect(() => {
    // Si tu as une logique pour récupérer les messages non lus depuis le backend
    // Tu peux appeler l'API et mettre à jour `unreadMessages` en conséquence.
    const getUnreadMessages = async () => {
      // Exemple : supposons que tu récupères le nombre de messages non lus via une API
      // const response = await api.get("/messages/unread"); // Implémenter selon ton API
      setUnreadMessages(3); // Exemple de 3 messages non lus
    };

    getUnreadMessages();
  }, []);

  const handlePress = () => {
    // Ouvre la vue de chat lorsque l'utilisateur clique sur la bulle
    router.push("/screens/chat");
  };

  return (
    <View style={styles.container}>
      {unreadMessages > 0 && (
        <TouchableOpacity style={styles.bubble} onPress={handlePress}>
          <Text style={styles.text}>{unreadMessages}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 9999, // S'assurer que la bulle est au-dessus des autres éléments
  },
  bubble: {
    backgroundColor: "#007bff", // Couleur bleue pour la bulle
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BubbleMessage;
