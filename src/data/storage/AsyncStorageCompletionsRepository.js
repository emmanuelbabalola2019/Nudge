//
//  AsyncStorageCompletionsRepository.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "./AsyncStorageKeys";
import { startOfLocalDayISO } from "../../infra/time/dateUtils";

export default class AsyncStorageCompletionsRepository {
  async _readAll() {
    const raw = await AsyncStorage.getItem(KEYS.COMPLETIONS);
    return raw ? JSON.parse(raw) : [];
  }

  async _writeAll(items) {
    await AsyncStorage.setItem(KEYS.COMPLETIONS, JSON.stringify(items));
  }

  async add(habitId, tsISO, note) {
    const all = await this._readAll();
    all.push({ id: `${habitId}:${tsISO}`, habitId, tsISO, note: note || "" });
    await this._writeAll(all);
  }

  async listForDay(dayISO) {
    const all = await this._readAll();
    return all.filter((c) => startOfLocalDayISO(new Date(c.tsISO)) === dayISO);
  }
}
