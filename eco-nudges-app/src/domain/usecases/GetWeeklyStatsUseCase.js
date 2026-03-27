//
//  GetWeeklyStatsUseCase.js
//  
//
//  Created by Emmanuel Babalola on 3/27/26.
//
import { getLastNDays } from "../../infra/time/dateUtils";

export default class GetWeeklyStatsUseCase {
  constructor({ habitsRepo, userHabitsRepo, completionsRepo }) {
    this.habitsRepo = habitsRepo;
    this.userHabitsRepo = userHabitsRepo;
    this.completionsRepo = completionsRepo;
  }

  async execute() {
    const days = getLastNDays(7);
    const startISO = days[0].iso;
    const endISO = days[days.length - 1].iso;

    const [allHabits, activeHabits, completions] = await Promise.all([
      this.habitsRepo.listAll(),
      this.userHabitsRepo.listActive(),
      this.completionsRepo.listBetween(startISO, endISO),
    ]);

    const activeHabitIds = new Set(activeHabits.map((h) => h.habitId));
    const activeHabitMeta = allHabits.filter((h) => activeHabitIds.has(h.id));

    const dayMap = {};
    days.forEach((d) => {
      dayMap[d.iso] = [];
    });

    completions.forEach((c) => {
      const iso = c.tsISO.slice(0, 10);
      if (dayMap[iso]) {
        dayMap[iso].push(c);
      }
    });

    const grid = days.map((d) => {
      const dayCompletions = dayMap[d.iso] || [];
      const completedHabitIds = new Set(dayCompletions.map((c) => c.habitId));

      return {
        ...d,
        completedCount: completedHabitIds.size,
        totalCount: activeHabitMeta.length,
        isFull: activeHabitMeta.length > 0 && completedHabitIds.size === activeHabitMeta.length,
        isPartial: completedHabitIds.size > 0 && completedHabitIds.size < activeHabitMeta.length,
        isEmpty: completedHabitIds.size === 0,
      };
    });

    const totalCompletions = completions.length;
    const currentStreak = this._computeCurrentStreak(grid);

    const impact = this._computeImpact(completions, allHabits);

    return {
      grid,
      totalCompletions,
      currentStreak,
      impact,
      activeHabitCount: activeHabitMeta.length,
    };
  }

  _computeCurrentStreak(grid) {
    let streak = 0;

    for (let i = grid.length - 1; i >= 0; i--) {
      if (grid[i].completedCount > 0) streak += 1;
      else break;
    }

    return streak;
  }

  _computeImpact(completions, habits) {
    const habitById = {};
    habits.forEach((h) => {
      habitById[h.id] = h;
    });

    let bottlesAvoided = 0;
    let disposableSetsAvoided = 0;
    let standbyDevicesReduced = 0;
    let lowImpactMeals = 0;
    let shortTripsSwapped = 0;
    let coldLoads = 0;
    let showerWins = 0;
    let lightOffWins = 0;

    completions.forEach((c) => {
      switch (c.habitId) {
        case "bottle":
          bottlesAvoided += 1;
          break;
        case "utensils":
          disposableSetsAvoided += 1;
          break;
        case "unplug":
          standbyDevicesReduced += 1;
          break;
        case "meatfree":
          lowImpactMeals += 1;
          break;
        case "walk":
          shortTripsSwapped += 1;
          break;
        case "coldwash":
          coldLoads += 1;
          break;
        case "shower":
          showerWins += 1;
          break;
        case "lights":
          lightOffWins += 1;
          break;
        default:
          break;
      }
    });

    return {
      bottlesAvoided,
      disposableSetsAvoided,
      standbyDevicesReduced,
      lowImpactMeals,
      shortTripsSwapped,
      coldLoads,
      showerWins,
      lightOffWins,
      summary: [
        bottlesAvoided > 0 ? `≈ ${bottlesAvoided} plastic bottles avoided` : null,
        disposableSetsAvoided > 0 ? `≈ ${disposableSetsAvoided} disposable utensil sets skipped` : null,
        lowImpactMeals > 0 ? `≈ ${lowImpactMeals} lower-impact meals chosen` : null,
        shortTripsSwapped > 0 ? `≈ ${shortTripsSwapped} short car trips swapped` : null,
        coldLoads > 0 ? `≈ ${coldLoads} laundry loads run cold` : null,
        showerWins > 0 ? `≈ ${showerWins} shorter showers taken` : null,
        lightOffWins > 0 ? `≈ ${lightOffWins} lights-off wins logged` : null,
        standbyDevicesReduced > 0 ? `≈ ${standbyDevicesReduced} standby devices unplugged` : null,
      ].filter(Boolean),
    };
  }
}
