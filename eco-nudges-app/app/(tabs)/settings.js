//
//  settings.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, Pressable, Switch, Alert } from "react-native";
import { createAppServices } from "../../src/appstate/di";

function HourRow({ label, value, onMinus, onPlus }) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <Text className="text-base text-slate-800">{label}</Text>

      <View className="flex-row items-center gap-3">
        <Pressable
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          onPress={onMinus}
        >
          <Text className="text-xl font-semibold">−</Text>
        </Pressable>

        <View className="w-16 items-center">
          <Text className="text-lg font-semibold">{value}:00</Text>
        </View>

        <Pressable
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          onPress={onPlus}
        >
          <Text className="text-xl font-semibold">+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const services = useMemo(() => createAppServices(), []);
  const [prefs, setPrefs] = useState(null);

  async function load() {
    const current = await services.prefsRepo.get();
    setPrefs(current);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function update(partial) {
    const next = await services.updatePrefs.execute(partial);
    setPrefs(next);
  }

  async function saveAndReschedule() {
    await services.processIgnoredNudges.execute();
    await services.scheduleTodayNudges.execute();
    Alert.alert("Saved", "Quiet hours and smart nudges updated.");
  }

  if (!prefs) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-slate-500">Loading settings…</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="px-5 pt-6 pb-6">
        <Text className="text-3xl font-bold">Settings</Text>
        <Text className="text-slate-600 mt-2">
          Control when and how your nudges show up.
        </Text>
      </View>

      <View className="px-5 pb-10 gap-5">
        <View className="bg-white border border-slate-200 rounded-3xl p-4">
          <Text className="text-lg font-semibold">Quiet hours</Text>
          <Text className="text-slate-600 mt-1">
            Nudges will avoid this time range.
          </Text>

          <View className="mt-4">
            <HourRow
              label="Quiet starts"
              value={prefs.quietStartHour}
              onMinus={() =>
                update({ quietStartHour: (prefs.quietStartHour + 23) % 24 })
              }
              onPlus={() =>
                update({ quietStartHour: (prefs.quietStartHour + 1) % 24 })
              }
            />
            <HourRow
              label="Quiet ends"
              value={prefs.quietEndHour}
              onMinus={() =>
                update({ quietEndHour: (prefs.quietEndHour + 23) % 24 })
              }
              onPlus={() =>
                update({ quietEndHour: (prefs.quietEndHour + 1) % 24 })
              }
            />
          </View>
        </View>

        <View className="bg-white border border-slate-200 rounded-3xl p-4">
          <Text className="text-lg font-semibold">Smart nudges</Text>
          <Text className="text-slate-600 mt-1">
            Reduce notification frequency when nudges are repeatedly ignored.
          </Text>

          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-base text-slate-800">Enable smart nudges</Text>
            <Switch
              value={!!prefs.enableSmartNudges}
              onValueChange={(value) => update({ enableSmartNudges: value })}
            />
          </View>
        </View>

        <View className="bg-white border border-slate-200 rounded-3xl p-4">
          <Text className="text-lg font-semibold">Daily cap</Text>
          <Text className="text-slate-600 mt-1">
            Maximum nudges across all habits in a day.
          </Text>

          <View className="mt-4">
            <HourRow
              label="Max nudges/day"
              value={prefs.maxNudgesPerDay}
              onMinus={() =>
                update({
                  maxNudgesPerDay: Math.max(1, prefs.maxNudgesPerDay - 1),
                })
              }
              onPlus={() =>
                update({
                  maxNudgesPerDay: Math.min(10, prefs.maxNudgesPerDay + 1),
                })
              }
            />
          </View>
        </View>

        <Pressable
          className="bg-black rounded-2xl px-4 py-4"
          onPress={saveAndReschedule}
        >
          <Text className="text-white text-center font-semibold">
            Save and reschedule nudges
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
