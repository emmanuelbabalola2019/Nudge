//
//  _layout.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import { Stack } from "expo-router";
import "../src/infra/notifications/notificationSetup";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
