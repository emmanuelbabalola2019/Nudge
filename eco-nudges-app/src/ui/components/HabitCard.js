//
//  HabitCard.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//
import { View, Text, Pressable } from "react-native";

export default function HabitCard({ habit, onDone, onSnooze }) {
  return (
    <View className="border border-slate-200 rounded-2xl p-4 mb-4 bg-white">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-semibold">{habit.title}</Text>
          <Text className="text-slate-600 mt-1">{habit.description}</Text>

          <View className="mt-3 flex-row flex-wrap gap-2">
            <View className="bg-slate-100 px-3 py-1 rounded-full">
              <Text className="text-slate-700">Streak: {habit.streak ?? 0}</Text>
            </View>
            <View className="bg-slate-100 px-3 py-1 rounded-full">
              <Text className="text-slate-700">
                Ignored: {habit.ignoredStreak ?? 0}
              </Text>
            </View>
            {habit.doneToday ? (
              <View className="bg-emerald-100 px-3 py-1 rounded-full">
                <Text className="text-emerald-800">Done today</Text>
              </View>
            ) : (
              <View className="bg-amber-100 px-3 py-1 rounded-full">
                <Text className="text-amber-800">Not done yet</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row gap-3">
        <Pressable
          className={`flex-1 px-4 py-3 rounded-xl ${
            habit.doneToday ? "bg-slate-200" : "bg-black"
          }`}
          disabled={habit.doneToday}
          onPress={onDone}
        >
          <Text className={`text-center font-semibold ${habit.doneToday ? "text-slate-600" : "text-white"}`}>
            Done
          </Text>
        </Pressable>

        <Pressable
          className="flex-1 px-4 py-3 rounded-xl bg-slate-100"
          onPress={onSnooze}
        >
          <Text className="text-center font-semibold text-black">
            Snooze 30m
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
