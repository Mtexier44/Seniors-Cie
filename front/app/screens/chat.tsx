import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MessageListItem, PopulatedMessage } from "@/types/props";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../routes/api";

const ChatScreen: React.FC = () => {
  const { receiverId, receiverName } = useLocalSearchParams<{
    receiverId: string;
    receiverName: string;
  }>();

  const [messages, setMessages] = useState<PopulatedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList<MessageListItem>>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token || !receiverId) {
        throw new Error("Token ou ID destinataire manquant");
      }

      const response = await api.get(`/messages/conversation/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(response.data);

      // Marquer les messages comme lus
      await markMessagesAsSeen(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      Alert.alert("Erreur", "Impossible de charger les messages");
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsSeen = async (msgs: PopulatedMessage[]) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      // Trouver les messages non lus envoyés par l'autre utilisateur
      const unreadMessages = msgs.filter(
        (msg) => !msg.seen && msg.sender._id === receiverId
      );

      // Marquer chaque message comme lu
      for (const msg of unreadMessages) {
        await api.put(
          `/messages/${msg._id}/seen`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error("Erreur lors du marquage des messages comme lus:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token manquant");
      }

      const response = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserId(response.data._id);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
    }
  };

  useEffect(() => {
    if (receiverId) {
      fetchUserInfo();
      fetchMessages();

      // Rafraîchissement périodique des messages
      const interval = setInterval(fetchMessages, 10000);

      return () => clearInterval(interval);
    }
  }, [receiverId]);

  // Scroll vers le bas quand les messages changent
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    if (!receiverId) {
      Alert.alert("Erreur", "ID du destinataire manquant");
      return;
    }

    try {
      setSending(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token manquant");
      }

      const response = await api.post(
        "/messages",
        { receiver: receiverId, content: newMessage.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ajouter le nouveau message à la liste
      const newMsg = response.data.message;
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");

      // Option: Rafraîchir tous les messages
      fetchMessages();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      Alert.alert("Erreur", "Impossible d'envoyer le message");
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>{date}</Text>
    </View>
  );

  // Fonction pour formater les messages et ajouter des séparateurs de date
  const formattedMessages = (): MessageListItem[] => {
    let currentDate = "";
    const result: MessageListItem[] = [];

    messages.forEach((msg, index) => {
      const messageDate = new Date(msg.createdAt).toLocaleDateString();

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        result.push({
          _id: `date-${index}`,
          type: "dateSeparator",
          date: messageDate,
        });
      }

      result.push({
        ...msg,
        type: "message",
      });
    });

    return result;
  };

  if (!receiverId || !receiverName) {
    return (
      <View style={styles.centerContainer}>
        <Text>Informations de conversation manquantes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discussion avec {receiverName}</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#a213af" />
          <Text style={styles.loadingText}>Chargement des messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={formattedMessages()}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => {
            if (item.type === "dateSeparator" && "date" in item) {
              return renderDateSeparator(item.date);
            }

            // C'est un message
            if (item.type === "message") {
              return (
                <View
                  style={[
                    styles.messageContainer,
                    item.sender._id === userId
                      ? styles.myMessage
                      : styles.otherMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.sender._id === userId
                        ? styles.myMessageText
                        : styles.otherMessageText,
                    ]}
                  >
                    {item.content}
                  </Text>
                  <Text
                    style={[
                      styles.timeText,
                      item.sender._id === userId
                        ? styles.myTimeText
                        : styles.otherTimeText,
                    ]}
                  >
                    {formatMessageTime(item.createdAt)}
                  </Text>
                </View>
              );
            }

            return null;
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
          editable={!sending}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={[styles.sendButton, sending && styles.sendingButton]}
          disabled={sending || !newMessage.trim()}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.sendButtonText}>Envoyer</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#888",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  messagesList: {
    paddingVertical: 10,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 5,
    maxWidth: "80%",
    minWidth: 80,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#a213af",
    borderBottomRightRadius: 4,
    marginLeft: 50,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
    borderBottomLeftRadius: 4,
    marginRight: 50,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#333",
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  myTimeText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherTimeText: {
    color: "rgba(0, 0, 0, 0.5)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#a213af",
    padding: 12,
    borderRadius: 25,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  sendingButton: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 15,
  },
  dateSeparatorText: {
    backgroundColor: "#e0e0e0",
    color: "#666",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
});

export default ChatScreen;
