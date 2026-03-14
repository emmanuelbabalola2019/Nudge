//
//  today.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//

import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import HabitCard from "../../src/ui/components/HabitCard";
import { createAppServices } from "../../src/appstate/di";
import { startOfLocalDayISO } from "../../src/infra/time/dateUtils";

export default function TodayScreen() {
  const router = useRouter();
  const services = useMemo(() => createAppServices(), []);
  const [loading, setLoading] = useState(true);
  const [todayHabits, setTodayHabits] = useState([]);

  async function refresh() {
    setLoading(true);
    const res = await services.getTodayHabits.execute();
    setTodayHabits(res);
    setLoading(false);

    // If no active habits, route to onboarding
    if (res.length === 0) {
      router.replace("/(onboarding)");
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDone(habitId) {
    await services.completeHabit.execute({ habitId });
    await refresh();
  }

  async function onSnooze(habitId) {
    await services.snoozeHabit.execute({ habitId, minutes: 30 });
    Alert.alert("Snoozed", "I'll remind you again in 30 minutes.");
  }

  async function onTestNudge() {
    const dayISO = startOfLocalDayISO(new Date());
    await services.notifications.ensurePermission();

    await services.notifications.sendTestNow(
      "Quick eco-nudge 🌱",
      `Tiny win time. Want to mark a habit done? (${Platform.OS})`,
      { type: "test", dayISO }
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 pt-6 pb-4">
        <Text className="text-3xl font-bold">Today</Text>
        <Text className="text-slate-600 mt-2">
          Pick one small win. Keep it easy.
        </Text>

        <View className="mt-4 flex-row gap-3">
          <Pressable
            className="bg-black px-4 py-3 rounded-xl"
            onPress={() => router.push("/(onboarding)")}
          >
            <Text className="text-white font-semibold">Change habits</Text>
          </Pressable>

          <Pressable
            className="bg-slate-100 px-4 py-3 rounded-xl"
            onPress={onTestNudge}
          >
            <Text className="text-black font-semibold">Send test nudge</Text>
          </Pressable>
        </View>
      </View>

      <View className="px-5 pb-10">
        {loading ? (
          <Text className="text-slate-500 mt-2">Loading…</Text>
        ) : todayHabits.length === 0 ? (
          <Text className="text-slate-500 mt-2">No habits selected yet.</Text>
        ) : (
          todayHabits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onDone={() => onDone(h.id)}
              onSnooze={() => onSnooze(h.id)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
