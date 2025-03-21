import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="profil" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
      <Stack.Screen name="profiluser" options={{ headerShown: false }} />
      <Stack.Screen name="services" options={{ headerShown: false }} />
      <Stack.Screen name="users" options={{ headerShown: false }} />
      <Stack.Screen name="conversations" options={{ headerShown: false }} />
    </Stack>
  );
}
