//
//  ScheduleTodayNudgesUseCase.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//
import {
  buildNextWindowDate,
  moveToNextNonQuietHour,
} from "../../infra/time/dateUtils";

export default class ScheduleTodayNudgesUseCase {
  constructor({
    habitsRepo,
    userHabitsRepo,
    notifications,
    prefsRepo,
  }) {
    this.habitsRepo = habitsRepo;
    this.userHabitsRepo = userHabitsRepo;
    this.notifications = notifications;
    this.prefsRepo = prefsRepo;
  }

  async execute() {
    const status = await this.notifications.ensurePermission();
    if (status !== "granted") return;

    const prefs = await this.prefsRepo.get();
    const active = await this.userHabitsRepo.listActive();
    const allHabits = await this.habitsRepo.listAll();

    let scheduledCount = 0;

    for (const uh of active) {
      const habit = allHabits.find((h) => h.id === uh.habitId);
      if (!habit) continue;

      const ignoredStreak = uh.ignoredStreak || 0;
      const nudgesForHabit = this._computeAdaptiveNudgeCount(
        habit.defaultDailyNudges || 1,
        ignoredStreak,
        prefs.enableSmartNudges
      );

      const windows = Array.isArray(habit.windows) && habit.windows.length
        ? habit.windows
        : ["anytime"];

      const windowsToUse = windows.slice(0, nudgesForHabit);

      for (const windowKey of windowsToUse) {
        if (scheduledCount >= (prefs.maxNudgesPerDay || 4)) return;

        let fireDate = buildNextWindowDate(windowKey, new Date());
        fireDate = moveToNextNonQuietHour(
          fireDate,
          prefs.quietStartHour,
          prefs.quietEndHour
        );

        await this.notifications.scheduleLocalNudge({
          habitId: habit.id,
          title: this._titleForWindow(windowKey),
          body: this._bodyForHabit(habit.title, windowKey),
          fireDate,
          windowKey,
        });

        scheduledCount += 1;
      }
    }
  }

  _computeAdaptiveNudgeCount(baseCount, ignoredStreak, enableSmartNudges) {
    if (!enableSmartNudges) return Math.max(1, baseCount);

    if (ignoredStreak >= 5) return 1;
    if (ignoredStreak >= 3) return Math.max(1, baseCount - 1);
    return Math.max(1, baseCount);
  }

  _titleForWindow(windowKey) {
    switch (windowKey) {
      case "morning":
        return "Morning eco nudge 🌅";
      case "commute":
        return "Commute eco nudge 🚶";
      case "evening":
        return "Evening eco nudge 🌙";
      default:
        return "Tiny win time 🌱";
    }
  }

  _bodyForHabit(title, windowKey) {
    switch (windowKey) {
      case "morning":
        return `Starting your day? Try this: ${title}`;
      case "commute":
        return `On the move today? ${title}`;
      case "evening":
        return `Quick end-of-day win: ${title}`;
      default:
        return `Want to do this today? ${title}`;
    }
  }
}
