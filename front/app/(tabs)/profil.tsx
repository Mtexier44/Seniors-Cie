import { useState } from "react";
import { Tabs, useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from "react-native";

const Profil = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Afficher ou masquer le menu
  const router = useRouter();

  const handleProfileClick = () => {
    setIsMenuVisible(!isMenuVisible); // Toggle le menu de connexion/inscription
  };

  const handleLoginClick = () => {
    setIsMenuVisible(false); // Ferme le menu
    router.push("/screens/login"); // Redirige vers l'écran de connexion
  };

  const handleRegisterClick = () => {
    setIsMenuVisible(false); // Ferme le menu
    router.push("/screens/RegisterScreen"); // Redirige vers l'écran d'inscription
  };

  return (
    <>
      {/* Barre de navigation personnalisée */}
      <SafeAreaView>
        {/* Bouton Profil */}
        <TouchableOpacity onPress={handleProfileClick}>
          <Image
            source={require("../../assets/images/profil.png")}
            style={{ width: 40, height: 40, borderRadius: 30 }}
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Menu déroulant pour Connexion / Inscription */}
      {isMenuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleLoginClick} style={styles.menuItem}>
            <Text style={styles.menuText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegisterClick}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  titre: {
    fontSize: 16,
    color: "#333",
  },
  menu: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    width: 150,
    zIndex: 100,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default Profil;
