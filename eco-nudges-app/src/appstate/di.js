//
//  di.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import SeedHabitsRepository from "../data/seed/SeedHabitsRepository";
import AsyncStorageUserHabitsRepository from "../data/storage/AsyncStorageUserHabitsRepository";
import AsyncStorageCompletionsRepository from "../data/storage/AsyncStorageCompletionsRepository";
import AsyncStoragePrefsRepository from "../data/storage/AsyncStoragePrefsRepository";
import AsyncStorageNotificationEventsRepository from "../data/storage/AsyncStorageNotificationEventsRepository";

import ExpoNotificationService from "../infra/notifications/ExpoNotificationService";

import GetTodayHabitsUseCase from "../domain/usecases/GetTodayHabitsUseCase";
import CompleteHabitUseCase from "../domain/usecases/CompleteHabitUseCase";
import SnoozeHabitUseCase from "../domain/usecases/SnoozeHabitUseCase";
import ScheduleTodayNudgesUseCase from "../domain/usecases/ScheduleTodayNudgesUseCase";
import GetWeeklyStatsUseCase from "../domain/usecases/GetWeeklyStatsUseCase";
import ProcessIgnoredNudgesUseCase from "../domain/usecases/ProcessIgnoredNudgesUseCase";
import UpdatePrefsUseCase from "../domain/usecases/UpdatePrefsUseCase";

export function createAppServices() {
  const habitsRepo = new SeedHabitsRepository();
  const userHabitsRepo = new AsyncStorageUserHabitsRepository();
  const completionsRepo = new AsyncStorageCompletionsRepository();
  const prefsRepo = new AsyncStoragePrefsRepository();
  const notificationEventsRepo = new AsyncStorageNotificationEventsRepository();

  const notifications = new ExpoNotificationService({ notificationEventsRepo });

  const getTodayHabits = new GetTodayHabitsUseCase({
    habitsRepo,
    userHabitsRepo,
    completionsRepo,
  });

  const completeHabit = new CompleteHabitUseCase({
    userHabitsRepo,
    completionsRepo,
    notifications,
  });

  const snoozeHabit = new SnoozeHabitUseCase({
    habitsRepo,
    notifications,
  });

  const scheduleTodayNudges = new ScheduleTodayNudgesUseCase({
    habitsRepo,
    userHabitsRepo,
    notifications,
    prefsRepo,
  });

  const getWeeklyStats = new GetWeeklyStatsUseCase({
    habitsRepo,
    userHabitsRepo,
    completionsRepo,
  });

  const processIgnoredNudges = new ProcessIgnoredNudgesUseCase({
    notificationEventsRepo,
    userHabitsRepo,
  });

  const updatePrefs = new UpdatePrefsUseCase({
    prefsRepo,
  });

  return {
    habitsRepo,
    userHabitsRepo,
    completionsRepo,
    prefsRepo,
    notificationEventsRepo,
    notifications,
    getTodayHabits,
    completeHabit,
    snoozeHabit,
    scheduleTodayNudges,
    getWeeklyStats,
    processIgnoredNudges,
    updatePrefs,
  };
}
