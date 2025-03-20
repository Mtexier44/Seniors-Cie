import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, useRouter } from "expo-router";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { overlay } from "react-native-paper";

const { width, height } = Dimensions.get("window");

type TabName = "home" | "search" | "begin";

interface Tab {
  name: TabName;
  label: string;
}

export default function Layout() {
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsLoggedIn(!!token); // Si un token est présent, l'utilisateur est connecté
    };

    checkLoginStatus();
  }, []);

  const handleTabPress = (tabName: TabName) => {
    setActiveTab(tabName);
    router.push(`/${tabName}`);
  };

  const handleProfileClick = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleLoginClick = () => {
    setIsMenuVisible(false);
    router.push("/screens/login");
  };

  const handleRegisterClick = () => {
    setIsMenuVisible(false);
    router.push("/screens/RegisterScreen");
  };

  const handleProfilClick = () => {
    setIsMenuVisible(false);
    router.push("/screens/profiluser");
  };

  const tabs: Tab[] = [
    { name: "home", label: "Accueil" },
    { name: "search", label: "Je cherche" },
    { name: "begin", label: "Je veux devenir" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre supérieure avec logo et profil */}
      <View style={styles.topBar}>
        <Image
          source={require("@/assets/images/gerologo.png")}
          style={styles.logo}
        />
        <TouchableOpacity onPress={handleProfileClick}>
          <Image
            source={require("@/assets/images/profil.png")}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Image principale */}
      <Image
        source={require("@/assets/images/becomegero.png")}
        style={styles.mainImage}
      />

      {/* Tabs au milieu en ligne */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tab,
              activeTab === tab.name ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => handleTabPress(tab.name as TabName)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.name
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu déroulant pour Connexion / Inscription */}
      {isMenuVisible && (
        <View style={styles.overlay}>
          <View style={[styles.menu, styles.centeredMenu]}>
            <TouchableOpacity
              onPress={handleLoginClick}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRegisterClick}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>S'inscrire</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleProfilClick}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Profil</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tabs (écrans) */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      >
        <Tabs.Screen name="home" options={{ headerShown: false }} />
        <Tabs.Screen name="begin" options={{ headerShown: false }} />
        <Tabs.Screen name="search" options={{ headerShown: false }} />
        <Tabs.Screen name="login" options={{ headerShown: false }} />
        <Tabs.Screen name="register" options={{ headerShown: false }} />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mainImage: {
    width: width,
    height: height * 0.3,
    resizeMode: "cover",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  activeTab: {
    backgroundColor: "#007BFF",
  },
  inactiveTab: {
    backgroundColor: "#f0f0f0",
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    color: "white",
  },
  inactiveTabText: {
    color: "#333",
  },
  menu: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: width * 0.8, // Largeur de la carte (80% de la largeur de l'écran)
    maxWidth: 400, // Largeur maximale de la carte
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  centeredMenu: {
    // Style pour centrer le menu
    left: width / 2 - 75, // Calcule la position pour centrer le menu
    right: null, // Supprime la position à droite
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", // Fond semi-transparent
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
