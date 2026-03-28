//
//  AsyncStorageNotificationEventsRepository.js
//  
//
//  Created by Emmanuel Babalola on 3/27/26.
//
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KEYS } from "./AsyncStorageKeys";

export default class AsyncStorageNotificationEventsRepository {
  async _readAll() {
    const raw = await AsyncStorage.getItem(KEYS.NOTIF_EVENTS);
    return raw ? JSON.parse(raw) : [];
  }

  async _writeAll(items) {
    await AsyncStorage.setItem(KEYS.NOTIF_EVENTS, JSON.stringify(items));
  }

  async add(event) {
    const all = await this._readAll();
    all.push(event);
    await this._writeAll(all);
  }

  async listAll() {
    return await this._readAll();
  }

  async listByHabitId(habitId) {
    const all = await this._readAll();
    return all.filter((e) => e.habitId === habitId);
  }

  async markScheduledNotificationOpened(notificationId) {
    const all = await this._readAll();
    const idx = all.findIndex((e) => e.notificationId === notificationId);
    if (idx >= 0) {
      all[idx] = {
        ...all[idx],
        status: "opened",
        openedAtISO: new Date().toISOString(),
      };
      await this._writeAll(all);
    }
  }

  async markDueNotificationsIgnored(now = new Date()) {
    const all = await this._readAll();
    let changed = false;

    const next = all.map((e) => {
      if (
        e.status === "scheduled" &&
        e.fireDateISO &&
        new Date(e.fireDateISO) < now
      ) {
        changed = true;
        return {
          ...e,
          status: "ignored",
          ignoredAtISO: now.toISOString(),
        };
      }
      return e;
    });

    if (changed) {
      await this._writeAll(next);
    }

    return next;
  }
}
