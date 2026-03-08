//
//  AsyncStorageUserHabitsRepository.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "./AsyncStorageKeys";

function nowISO() {
  return new Date().toISOString();
}

export default class AsyncStorageUserHabitsRepository {
  async _readAll() {
    const raw = await AsyncStorage.getItem(KEYS.USER_HABITS);
    return raw ? JSON.parse(raw) : [];
  }

  async _writeAll(items) {
    await AsyncStorage.setItem(KEYS.USER_HABITS, JSON.stringify(items));
  }

  async listActive() {
    const all = await this._readAll();
    return all.filter((x) => x.active);
  }

  async get(habitId) {
    const all = await this._readAll();
    return all.find((x) => x.habitId === habitId) || null;
  }

  async activate(habitId) {
    const all = await this._readAll();
    const existing = all.find((x) => x.habitId === habitId);
    if (existing) {
      existing.active = true;
      if (!existing.startedAtISO) existing.startedAtISO = nowISO();
    } else {
      all.push({
        habitId,
        active: true,
        startedAtISO: nowISO(),
        streak: 0,
        ignoredStreak: 0,
      });
    }
    await this._writeAll(all);
  }

  async deactivate(habitId) {
    const all = await this._readAll();
    const existing = all.find((x) => x.habitId === habitId);
    if (existing) existing.active = false;
    await this._writeAll(all);
  }

  async update(userHabit) {
    const all = await this._readAll();
    const idx = all.findIndex((x) => x.habitId === userHabit.habitId);
    if (idx >= 0) all[idx] = userHabit;
    else all.push(userHabit);
    await this._writeAll(all);
  }
}
