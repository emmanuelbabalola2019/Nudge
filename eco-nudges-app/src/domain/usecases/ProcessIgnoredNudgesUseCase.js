//
//  ProcessIgnoredNudgesUseCase.js
//  
//
//  Created by Emmanuel Babalola on 3/27/26.
//

export default class ProcessIgnoredNudgesUseCase {
  constructor({ notificationEventsRepo, userHabitsRepo }) {
    this.notificationEventsRepo = notificationEventsRepo;
    this.userHabitsRepo = userHabitsRepo;
  }

  async execute() {
    const events = await this.notificationEventsRepo.markDueNotificationsIgnored(new Date());
    const active = await this.userHabitsRepo.listActive();

    for (const habit of active) {
      const relevant = events
        .filter((e) => e.habitId === habit.habitId)
        .sort((a, b) => new Date(b.fireDateISO) - new Date(a.fireDateISO));

      let ignoredStreak = 0;
      for (const event of relevant) {
        if (event.status === "ignored") ignoredStreak += 1;
        else if (event.status === "opened") break;
        else break;
      }

      await this.userHabitsRepo.update({
        ...habit,
        ignoredStreak,
      });
    }
  }
}
