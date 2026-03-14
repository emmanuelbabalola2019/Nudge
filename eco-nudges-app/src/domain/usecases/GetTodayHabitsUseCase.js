//
//  GetTodayHabitsUseCase.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//

import { startOfLocalDayISO } from "../../infra/time/dateUtils";

export default class GetTodayHabitsUseCase {
  constructor({ habitsRepo, userHabitsRepo, completionsRepo }) {
    this.habitsRepo = habitsRepo;
    this.userHabitsRepo = userHabitsRepo;
    this.completionsRepo = completionsRepo;
  }

  async execute() {
    const active = await this.userHabitsRepo.listActive();
    const allHabits = await this.habitsRepo.listAll();
    const dayISO = startOfLocalDayISO(new Date());
    const completions = await this.completionsRepo.listForDay(dayISO);
    const completedSet = new Set(completions.map((c) => c.habitId));

    // join + decorate
    return active
      .map((uh) => {
        const h = allHabits.find((x) => x.id === uh.habitId);
        if (!h) return null;
        return {
          ...h,
          streak: uh.streak || 0,
          doneToday: completedSet.has(h.id),
          lastDoneAtISO: uh.lastDoneAtISO,
        };
      })
      .filter(Boolean);
  }
}
