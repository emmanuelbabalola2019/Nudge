//
//  CompleteHabitUseCase.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//

import { isSameLocalDay } from "../../infra/time/dateUtils";

export default class CompleteHabitUseCase {
  constructor({ userHabitsRepo, completionsRepo, notifications }) {
    this.userHabitsRepo = userHabitsRepo;
    this.completionsRepo = completionsRepo;
    this.notifications = notifications;
  }

  async execute({ habitId }) {
    const now = new Date();
    const tsISO = now.toISOString();

    // store completion
    await this.completionsRepo.add(habitId, tsISO);

    // update streak
    const uh = await this.userHabitsRepo.get(habitId);
    if (uh) {
      const last = uh.lastDoneAtISO ? new Date(uh.lastDoneAtISO) : null;
      const doneAlreadyToday = last ? isSameLocalDay(last, now) : false;

      const next = { ...uh };
      if (!doneAlreadyToday) next.streak = (next.streak || 0) + 1;
      next.lastDoneAtISO = tsISO;
      next.ignoredStreak = 0;

      await this.userHabitsRepo.update(next);
    }

    // cancel remaining nudges today for this habit
    await this.notifications.cancelByHabitForToday(habitId);
  }
}
