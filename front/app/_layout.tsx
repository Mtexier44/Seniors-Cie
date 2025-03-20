import { Stack } from "expo-router";
//import ProfileScreen from "./screens/profil";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="profil" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
    </Stack>
  );
}
