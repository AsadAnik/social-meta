import React from "react";
import { Stack } from "expo-router";
import UploadProfile from "./UploadProfile";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function AuthLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
        <Stack.Screen name="register2" options={{ title: "Register2" }} />
        <Stack.Screen name="register3" options={{ title: "Register3" }} />
        <Stack.Screen
          name="UploadProfile"
          options={{ title: "UploadProfile" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
