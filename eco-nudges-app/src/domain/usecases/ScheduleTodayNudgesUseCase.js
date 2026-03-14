//
//  ScheduleTodayNudgesUseCase.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//

export default class ScheduleTodayNudgesUseCase {
  constructor({ habitsRepo, userHabitsRepo, notifications, prefsRepo }) {
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

    // MVP-simple: schedule ONE nudge per active habit at 7pm local (or next day 9am if past 7pm)
    const now = new Date();
    let fire = new Date(now);
    const hour = fire.getHours();

    if (hour >= 19) {
      // tomorrow 9am
      fire.setDate(fire.getDate() + 1);
      fire.setHours(9, 0, 0, 0);
    } else {
      // today 7pm
      fire.setHours(19, 0, 0, 0);
    }

    // respect quiet hours very simply
    const quietStart = prefs.quietStartHour ?? 21;
    const quietEnd = prefs.quietEndHour ?? 7;
    const fireHour = fire.getHours();
    const inQuiet = fireHour >= quietStart || fireHour < quietEnd;
    if (inQuiet) {
      fire.setHours(9, 0, 0, 0);
      if (fire <= now) fire.setDate(fire.getDate() + 1);
    }

    for (const uh of active) {
      const habit = allHabits.find((h) => h.id === uh.habitId);
      if (!habit) continue;

      await this.notifications.scheduleLocalNudge({
        habitId: habit.id,
        title: "Tiny win time 🌱",
        body: `Want to do this today? ${habit.title}`,
        fireDate: fire,
      });
    }
  }
}
