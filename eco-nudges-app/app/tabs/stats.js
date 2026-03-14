//
//  stats.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import { View, Text } from "react-native";

export default function StatsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-xl font-bold">Stats</Text>
      <Text className="text-slate-600 mt-2 text-center">
        Coming next: weekly grid + streaks + impact equivalents.
      </Text>
    </View>
  );
}
