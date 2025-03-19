const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "messaging_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

app.get("/messages", (req, res) => {
  db.query("SELECT * FROM messages", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

io.on("connection", (socket) => {
  console.log("Nouvel utilisateur connecté");

  socket.on("sendMessage", (message) => {
    const { sender, receiver, text } = message;
    db.query(
      "INSERT INTO messages (sender, receiver, text) VALUES (?, ?, ?)",
      [sender, receiver, text],
      (err, result) => {
        if (err) throw err;
        io.emit("receiveMessage", message);
      }
    );
  });
});

server.listen(3001, () => {
  console.log("Serveur backend sur port 3001");
});

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import io from "socket.io-client";
import Voice from "@react-native-voice/voice";

const socket = io("http://localhost:3001");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { sender: "User1", receiver: "User2", text: input };
      socket.emit("sendMessage", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
    }
  };

  const startListening = async () => {
    setIsListening(true);
    try {
      await Voice.start("fr-FR");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      setInput(event.value[0]);
      setIsListening(false);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text><Text style={{ fontWeight: "bold" }}>{item.sender}:</Text> {item.text}</Text>
        )}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Écrivez ou dictez votre message..."
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Envoyer" onPress={sendMessage} />
      <Button title={isListening ? "Écoute..." : "🎤 Dicter"} onPress={startListening} />
    </View>
  );
};

export default Chat;
