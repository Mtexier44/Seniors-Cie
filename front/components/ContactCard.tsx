import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const ContactCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Contact</Text>

      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        placeholderTextColor="#D81B60"
      />
      <TextInput
        style={styles.input}
        placeholder="Question"
        placeholderTextColor="#D81B60"
      />
      <TextInput
        style={styles.input}
        placeholder="N° téléphone"
        placeholderTextColor="#D81B60"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Mail"
        placeholderTextColor="#D81B60"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#D81B60",
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    backgroundColor: "#D81B60",
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: "#D81B60",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 5,
    color: "#D81B60",
  },
  button: {
    backgroundColor: "#D81B60",
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ContactCard;
