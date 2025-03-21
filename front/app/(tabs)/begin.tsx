import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";

const BeginGero = () => {
  const router = useRouter();

  const handleButton = () => {
    router.push("/screens/services");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Text}>
        {" "}
        Tu veux devenir un Géropote, voici nos offres:
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleButton}>
        <Text style={styles.buttonText}>Services</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  Text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4CAF50", // Couleur de fond
    paddingVertical: 12, // Espacement vertical
    paddingHorizontal: 24, // Espacement horizontal
    borderRadius: 8, // Bords arrondis
    elevation: 3, // Ombre sur Android
    shadowColor: "#000", // Ombre sur iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: "white", // Texte blanc
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default BeginGero;
