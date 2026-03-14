//
//  settings.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-xl font-bold">Settings</Text>
      <Text className="text-slate-600 mt-2 text-center">
        Coming next: quiet hours, nudge frequency, privacy toggles.
      </Text>
    </View>
  );
}
