import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ChatButton = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/screens/conversations");
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.chatButton}>
      <Ionicons name="chatbubbles-sharp" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = {
  chatButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4C88FF",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  } as const,
  chatIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
  } as const,
};

export default ChatButton;
