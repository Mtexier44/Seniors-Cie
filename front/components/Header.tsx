import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* Boutons de navigation */}
      <View style={styles.navLinks}>
        <TouchableOpacity onPress={() => navigation.navigate("Chercher")}>
          <Text style={styles.navText}>Je cherche un Géro’p-tes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Devenir")}>
          <Text style={styles.navText}>Je veux devenir un Géro’p-tes</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Contact */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => navigation.navigate("Contact")}
      >
        <Text style={styles.contactText}>Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#F9F9F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  navLinks: {
    flexDirection: "row",
    gap: 15,
  },
  navText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: "#FF4081",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  contactText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Header;
