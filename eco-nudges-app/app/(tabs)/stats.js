//
//  stats.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { createAppServices } from "../../src/appstate/di";

function StatCard({ title, value, subtitle }) {
  return (
    <View className="flex-1 bg-white border border-slate-200 rounded-2xl p-4">
      <Text className="text-slate-500 text-sm">{title}</Text>
      <Text className="text-2xl font-bold mt-2">{value}</Text>
      {subtitle ? <Text className="text-slate-600 mt-1">{subtitle}</Text> : null}
    </View>
  );
}

function DayCell({ day }) {
  let bg = "bg-slate-100";
  let text = "text-slate-500";

  if (day.isFull) {
    bg = "bg-black";
    text = "text-white";
  } else if (day.isPartial) {
    bg = "bg-emerald-200";
    text = "text-black";
  }

  return (
    <View className="items-center">
      <Text className="text-slate-500 text-xs mb-2">{day.label}</Text>
      <View className={`w-11 h-11 rounded-2xl items-center justify-center ${bg}`}>
        <Text className={`font-semibold ${text}`}>{day.dayNumber}</Text>
      </View>
      <Text className="text-[11px] text-slate-500 mt-2">
        {day.completedCount}/{day.totalCount}
      </Text>
    </View>
  );
}

export default function StatsScreen() {
  const services = useMemo(() => createAppServices(), []);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await services.getWeeklyStats.execute();
    setStats(res);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="px-5 pt-6 pb-6">
        <Text className="text-3xl font-bold">Stats</Text>
        <Text className="text-slate-600 mt-2">
          Your last 7 days of tiny wins.
        </Text>
      </View>

      {loading || !stats ? (
        <View className="px-5">
          <Text className="text-slate-500">Loading stats…</Text>
        </View>
      ) : (
        <>
          <View className="px-5 flex-row gap-3">
            <StatCard
              title="Current streak"
              value={`${stats.currentStreak} day${stats.currentStreak === 1 ? "" : "s"}`}
              subtitle="Days with at least one completion"
            />
            <StatCard
              title="Total completions"
              value={String(stats.totalCompletions)}
              subtitle="Across the last 7 days"
            />
          </View>

          <View className="px-5 mt-5">
            <View className="bg-white border border-slate-200 rounded-3xl p-4">
              <Text className="text-lg font-semibold">Weekly grid</Text>
              <Text className="text-slate-600 mt-1">
                Black = all active habits done. Green = partial progress.
              </Text>

              <View className="flex-row justify-between mt-5">
                {stats.grid.map((day) => (
                  <DayCell key={day.iso} day={day} />
                ))}
              </View>
            </View>
          </View>

          <View className="px-5 mt-5 pb-10">
            <View className="bg-white border border-slate-200 rounded-3xl p-4">
              <Text className="text-lg font-semibold">Impact equivalents</Text>
              <Text className="text-slate-600 mt-1">
                Simple approximations based on completed habits this week.
              </Text>

              {stats.impact.summary.length === 0 ? (
                <Text className="text-slate-500 mt-4">
                  Complete a few habits to start seeing impact here.
                </Text>
              ) : (
                <View className="mt-4 gap-3">
                  {stats.impact.summary.map((item) => (
                    <View
                      key={item}
                      className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50"
                    >
                      <Text className="text-slate-800">{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Pressable
                className="mt-5 bg-black rounded-2xl px-4 py-4"
                onPress={load}
              >
                <Text className="text-white text-center font-semibold">
                  Refresh stats
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}
