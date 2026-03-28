//
//  Untitled.swift
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "./AsyncStorageKeys";

const DEFAULT_PREFS = {
  quietStartHour: 21,
  quietEndHour: 7,
  maxNudgesPerDay: 4,
  enableSmartNudges: true,
};

export default class AsyncStoragePrefsRepository {
  async get() {
    const raw = await AsyncStorage.getItem(KEYS.PREFS);
    return raw ? JSON.parse(raw) : DEFAULT_PREFS;
  }

  async set(prefs) {
    await AsyncStorage.setItem(KEYS.PREFS, JSON.stringify(prefs));
  }

  async update(partialPrefs) {
    const current = await this.get();
    const next = { ...current, ...partialPrefs };
    await this.set(next);
    return next;
  }
}
