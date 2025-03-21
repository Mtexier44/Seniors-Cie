import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface GenericCardProps {
  title: string;
  children: React.ReactNode;
}

const GenericCard: React.FC<GenericCardProps> = ({ title, children }) => {
  return (
    <View style={styles.card}>
      <Image
        source={require("../assets/images/gerologo.png")}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 30,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    /*color: "#D81B60",
    backgroundColor: "#F8BBD0",*/
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
    textAlign: "center",
  },
  content: {
    width: "100%",
  },
});

export default GenericCard;
