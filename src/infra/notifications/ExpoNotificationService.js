//
//  ExpoNotificationService.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "../../data/storage/AsyncStorageKeys";
import { startOfLocalDayISO } from "../time/dateUtils";

export default class ExpoNotificationService {
  async ensurePermission() {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.status === "granted") return "granted";
    const req = await Notifications.requestPermissionsAsync();
    return req.status;
  }

  async sendTestNow(title, body, data) {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data || {} },
      trigger: null,
    });
  }

  async scheduleLocalNudge({ habitId, title, body, fireDate }) {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { habitId } },
      trigger: fireDate,
    });

    const dayISO = startOfLocalDayISO(fireDate);
    await this._indexNotifId(habitId, dayISO, id);

    return id;
  }

  async cancelByHabitForToday(habitId) {
    const dayISO = startOfLocalDayISO(new Date());
    const index = await this._readIndex();
    const ids = index?.[habitId]?.[dayISO] || [];
    for (const id of ids) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {}
    }
    // clear
    if (index[habitId]) index[habitId][dayISO] = [];
    await this._writeIndex(index);
  }

  async _readIndex() {
    const raw = await AsyncStorage.getItem(KEYS.NOTIF_INDEX);
    return raw ? JSON.parse(raw) : {};
  }

  async _writeIndex(obj) {
    await AsyncStorage.setItem(KEYS.NOTIF_INDEX, JSON.stringify(obj));
  }

  async _indexNotifId(habitId, dayISO, notifId) {
    const index = await this._readIndex();
    if (!index[habitId]) index[habitId] = {};
    if (!index[habitId][dayISO]) index[habitId][dayISO] = [];
    index[habitId][dayISO].push(notifId);
    await this._writeIndex(index);
  }
}
