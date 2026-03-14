//
//  index.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//

import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { createAppServices } from "../../src/appstate/di";

export default function OnboardingScreen() {
  const router = useRouter();
  const services = useMemo(() => createAppServices(), []);
  const [habits, setHabits] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    (async () => {
      const seed = await services.habitsRepo.listAll();
      setHabits(seed);
      const active = await services.userHabitsRepo.listActive();
      setActiveCount(active.length);

      // Preselect current active habits if any
      const s = new Set(active.map((x) => x.habitId));
      setSelected(s);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (next.size >= 2) {
          Alert.alert("Limit reached", "Pick up to 2 habits for now.");
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  }

  async function onContinue() {
    // Deactivate all, activate selected
    const current = await services.userHabitsRepo.listActive();
    for (const uh of current) await services.userHabitsRepo.deactivate(uh.habitId);
    for (const id of selected) await services.userHabitsRepo.activate(id);

    // Ask notifications permission + schedule a simple daily nudge per habit
    await services.notifications.ensurePermission();
    await services.scheduleTodayNudges.execute();

    router.replace("/(tabs)/today");
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 pt-10 pb-6">
        <Text className="text-3xl font-bold">Choose 1–2 habits</Text>
        <Text className="text-slate-600 mt-2">
          Keep it tiny. You can swap anytime.
        </Text>
        {activeCount > 0 ? (
          <Text className="text-slate-500 mt-2">
            You already have {activeCount} active. Changing will replace them.
          </Text>
        ) : null}
      </View>

      <View className="px-5 pb-5">
        {habits.map((h) => {
          const isOn = selected.has(h.id);
          return (
            <Pressable
              key={h.id}
              className={`border rounded-2xl p-4 mb-3 ${
                isOn ? "border-black bg-slate-50" : "border-slate-200 bg-white"
              }`}
              onPress={() => toggle(h.id)}
            >
              <Text className="text-lg font-semibold">{h.title}</Text>
              <Text className="text-slate-600 mt-1">{h.description}</Text>
              <Text className="text-slate-500 mt-2">
                Nudges: {h.defaultDailyNudges}/day
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="px-5 pb-10">
        <Pressable
          className={`px-5 py-4 rounded-2xl ${
            selected.size === 0 ? "bg-slate-200" : "bg-black"
          }`}
          disabled={selected.size === 0}
          onPress={onContinue}
        >
          <Text className={`text-center font-semibold ${selected.size === 0 ? "text-slate-600" : "text-white"}`}>
            Continue ({selected.size}/2)
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
