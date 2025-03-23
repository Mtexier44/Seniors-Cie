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
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../routes/api";

// Types definition
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Message {
  _id: string;
  content: string;
  sender: string | User;
  receiver: string | User;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PopulatedMessage extends Omit<Message, "sender" | "receiver"> {
  sender: User;
  receiver: User;
}

type DateSeparator = {
  _id: string;
  type: "dateSeparator";
  date: string;
};

type MessageItem = PopulatedMessage & { type: "message" };
type MessageListItem = DateSeparator | MessageItem;

const ChatScreen: React.FC = () => {
  const { receiverId, receiverName } = useLocalSearchParams<{
    receiverId: string;
    receiverName: string;
  }>();

  const [messages, setMessages] = useState<PopulatedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [receiverDetails, setReceiverDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList<MessageListItem>>(null);
  const isFetchingRef = useRef(false);

  // Fetch user information
  const fetchUserInfo = async () => {
    try {
      console.log(
        "fetchUserInfo: Début de la récupération des informations utilisateur"
      );
      const token = await AsyncStorage.getItem("token");
      console.log("fetchUserInfo: Token récupéré d'AsyncStorage:", token);
      if (!token) {
        throw new Error("Token manquant dans AsyncStorage");
      }

      console.log("fetchUserInfo: Envoi de la requête à /users/me");
      const response = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(
        "fetchUserInfo: Réponse de l'API /users/me:",
        JSON.stringify(response.data)
      );

      if (response.status !== 200) {
        throw new Error(
          `Erreur de l'API /users/me : Code d'état ${response.status}`
        );
      }

      setUserId(response.data._id);
      setUserDetails(response.data);
      console.log(
        "fetchUserInfo: Informations utilisateur récupérées avec succès"
      );
    } catch (error) {
      console.error(
        "fetchUserInfo: Erreur lors de la récupération des informations utilisateur:",
        error
      );
      console.error("fetchUserInfo: Erreur détaillée:", error);
      Alert.alert(
        "Erreur",
        "Impossible de charger votre profil. Veuillez réessayer plus tard."
      );
    }
  };

  // Fetch receiver information
  const fetchReceiverInfo = async () => {
    if (!receiverId) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token missing");
      }

      const response = await api.get(`/users/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Receiver details:", JSON.stringify(response.data));
      setReceiverDetails(response.data);
    } catch (error) {
      console.error("Error fetching receiver info:", error);

      // Create a fallback user object from URL params
      if (receiverId && receiverName) {
        const [firstName, lastName] = receiverName.split(" ");
        setReceiverDetails({
          _id: receiverId,
          firstName: firstName || receiverName,
          lastName: lastName || "",
          email: "",
        });
      }
    }
  };

  // Mark messages as seen
  const markMessagesAsSeen = async (msgs: PopulatedMessage[]) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      // Find unread messages sent by the other user
      const unreadMessages = msgs.filter(
        (msg) => !msg.seen && msg.sender._id === receiverId
      );

      // Mark each message as read
      for (const msg of unreadMessages) {
        await api.put(
          `/messages/${msg._id}/seen`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(`Marked message ${msg._id} as seen`);
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  // Fetch conversation messages
  const fetchMessages = async () => {
    if (isFetchingRef.current || !receiverId) return;

    try {
      isFetchingRef.current = true;
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token missing");
      }

      console.log(`Fetching messages for conversation with ${receiverId}`);

      const response = await api.get(`/messages/conversations/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response:", response.status);
      console.log("Messages from API:", JSON.stringify(response.data));

      if (Array.isArray(response.data)) {
        setMessages(response.data);
        await markMessagesAsSeen(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        if (typeof response.data === "object") {
          // If the response is an object with a messages property
          if (response.data.messages && Array.isArray(response.data.messages)) {
            setMessages(response.data.messages);
            await markMessagesAsSeen(response.data.messages);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      if (loading) {
        Alert.alert("Error", "Could not load messages");
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  const notifyConversationsScreen = async () => {
    try {
      await AsyncStorage.setItem("conversationsNeedRefresh", "true");
    } catch (error) {
      console.error("Error notifying about update:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (receiverId) {
      console.log("Chat screen mounted for receiver:", receiverId);
      fetchUserInfo();
      fetchReceiverInfo();
      fetchMessages();

      interval = setInterval(() => {
        console.log("Refreshing messages (interval)");
        fetchMessages();
      }, 15000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [receiverId]);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 200);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const messageContent = newMessage.trim();

    if (!messageContent) return;
    if (!receiverId) {
      Alert.alert("Erreur", "ID du destinataire manquant");
      return;
    }
    if (!userDetails) {
      Alert.alert(
        "Erreur",
        "Informations utilisateur manquantes. Veuillez réessayer plus tard."
      );
      return;
    }

    setNewMessage("");

    try {
      setSending(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Token missing");
      }

      const tempMsg: PopulatedMessage = {
        _id: `temp-${Date.now()}`,
        content: messageContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        seen: false,
        sender: userDetails,
        receiver: receiverDetails || {
          _id: receiverId,
          firstName: receiverName?.split(" ")[0] || "User",
          lastName: receiverName?.split(" ")[1] || "",
          email: "",
        },
      };

      setMessages((prevMessages) => [...prevMessages, tempMsg]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      console.log("Sending message:", {
        receiver: receiverId,
        content: messageContent,
      });

      const response = await api.post(
        "/messages",
        { receiver: receiverId, content: messageContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Message send API response:", JSON.stringify(response.data));

      const apiMessage = response.data.message || response.data;

      if (apiMessage && apiMessage._id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === tempMsg._id
              ? {
                  ...apiMessage,

                  sender: apiMessage.sender._id
                    ? apiMessage.sender
                    : tempMsg.sender,
                  receiver: apiMessage.receiver._id
                    ? apiMessage.receiver
                    : tempMsg.receiver,
                }
              : msg
          )
        );
      }

      // Notify conversations screen to refresh
      await notifyConversationsScreen();

      // Fetch all messages to ensure sync
      setTimeout(() => {
        fetchMessages();
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
      //Alert.alert("Error", "Could not send message");
      // Restore message to input field on error
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  // Format time display for messages
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Render date separator
  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>{date}</Text>
    </View>
  );

  // Format messages with date separators
  const formattedMessages = (): MessageListItem[] => {
    let currentDate = "";
    const result: MessageListItem[] = [];

    console.log(`Formatting ${messages.length} messages`);

    // Process each message
    messages.forEach((msg, index) => {
      const messageDate = new Date(msg.createdAt).toLocaleDateString();

      // Add date separator if this is a new date
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        result.push({
          _id: `date-${index}`,
          type: "dateSeparator",
          date: messageDate,
        });
      }

      // Add the message
      result.push({
        ...msg,
        type: "message",
      });
    });

    return result;
  };

  // Check for missing parameters
  if (!receiverId || !receiverName) {
    return (
      <View style={styles.centerContainer}>
        <Text>Missing conversation information</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {receiverName}</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4C88FF" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noMessagesText}>
            No messages yet. Start the conversation!
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={formattedMessages()}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => {
            // Handle date separator
            if (item.type === "dateSeparator" && "date" in item) {
              return renderDateSeparator(item.date);
            }

            // Handle message
            if (item.type === "message") {
              const isMyMessage = item.sender._id === userId;

              return (
                <View
                  style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessage : styles.otherMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMyMessage
                        ? styles.myMessageText
                        : styles.otherMessageText,
                    ]}
                  >
                    {item.content}
                  </Text>
                  <Text
                    style={[
                      styles.timeText,
                      isMyMessage ? styles.myTimeText : styles.otherTimeText,
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
          placeholder="Écrivez votre message..."
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
            <Text style={styles.sendButtonText}>Send</Text>
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
  noMessagesText: {
    color: "#888",
    fontSize: 16,
    fontStyle: "italic",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    paddingVertical: 15,
    textAlign: "center",
    color: "white",
    backgroundColor: "#D81B60",
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
    backgroundColor: "#D81B60",
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
    backgroundColor: "#D81B60",
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
