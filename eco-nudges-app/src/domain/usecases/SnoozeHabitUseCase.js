//
//  SnoozeHabitUseCase.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//

export default class SnoozeHabitUseCase {
  constructor({ habitsRepo, notifications }) {
    this.habitsRepo = habitsRepo;
    this.notifications = notifications;
  }

  async execute({ habitId, minutes }) {
    const habit = await this.habitsRepo.getById(habitId);
    if (!habit) return;

    const fireDate = new Date(Date.now() + minutes * 60 * 1000);
    await this.notifications.ensurePermission();

    await this.notifications.scheduleLocalNudge({
      habitId,
      title: "Eco nudge 🌱",
      body: `Quick reminder: ${habit.title}`,
      fireDate,
    });
  }
}
