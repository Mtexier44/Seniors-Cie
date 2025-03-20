import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import axios from "axios";
import Voice, { SpeechResultsEvent } from "@react-native-voice/voice";
import api from "@/routes/api";

interface User {
  _id: string;
  name: string;
}

interface Message {
  _id: string;
  sender: User;
  receiver: string;
  content: string;
  seen: boolean;
}

interface ChatProps {
  currentUser: User;
}

const Chat: React.FC<ChatProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Récupérer les messages de l'utilisateur
  const fetchMessages = async () => {
    if (!currentUser) return;

    try {
      const response = await api.get<Message[]>(`/messages/${currentUser._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des messages :", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Rafraîchissement toutes les 3s
    return () => clearInterval(interval);
  }, [currentUser]);

  // Envoyer un message
  const sendMessage = async () => {
    if (input.trim() === "" || receiverId.trim() === "") {
      Alert.alert(
        "Erreur",
        "Veuillez entrer un message et choisir un destinataire."
      );
      return;
    }

    const newMessage: Omit<Message, "_id" | "seen"> = {
      sender: currentUser,
      receiver: receiverId,
      content: input,
    };

    try {
      const response = await api.post<Message>("/messages", newMessage);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setInput("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      Alert.alert("Erreur", "Impossible d'envoyer le message.");
    }
  };

  // Marquer un message comme vu
  const markAsSeen = async (id: string) => {
    try {
      await api.put("/messages/${id}/seen");
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === id ? { ...msg, seen: true } : msg
        )
      );
    } catch (error) {
      console.error("Erreur lors du marquage du message comme vu :", error);
    }
  };

  // Reconnaissance vocale
  const startListening = async () => {
    setIsListening(true);
    try {
      await Voice.start("fr-FR");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      if (event.value && event.value.length > 0) {
        setInput(event.value[0]);
      }
      setIsListening(false);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Chat</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.sender._id === currentUser._id ? "Moi" : item.sender.name} :
            </Text>{" "}
            {item.content} {item.seen ? " ✅" : ""}
          </Text>
        )}
      />

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Écrivez ou dictez votre message..."
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Envoyer" onPress={sendMessage} />
      <Button
        title={isListening ? "Écoute..." : "🎤 Dicter"}
        onPress={startListening}
      />
    </View>
  );
};

export default Chat;
