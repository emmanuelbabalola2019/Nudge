//
//  habits.seed.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
export const HABITS_SEED = [
  {
    id: "bottle",
    title: "Bring a reusable bottle",
    description: "Skip one single-use bottle today.",
    windows: ["morning", "commute"],
    defaultDailyNudges: 1,
    unit: "count",
    impactEstimate: { label: "≈ bottles avoided", perUnitApprox: "≈ 1 bottle" },
  },
  {
    id: "lights",
    title: "Lights off when leaving",
    description: "Turn off lights when you leave the last room.",
    windows: ["evening", "anytime"],
    defaultDailyNudges: 1,
    unit: "count",
    impactEstimate: { label: "≈ energy saved", perUnitApprox: "≈ small daily savings" },
  },
  {
    id: "meatfree",
    title: "Meat-free lunch",
    description: "Try one plant-based lunch today.",
    windows: ["morning"],
    defaultDailyNudges: 1,
    unit: "count",
    impactEstimate: { label: "≈ lower impact meal", perUnitApprox: "≈ 1 meal" },
  },
  {
    id: "shower",
    title: "Shorter shower",
    description: "Aim for under 5 minutes.",
    windows: ["morning", "evening"],
    defaultDailyNudges: 1,
    unit: "minutes",
    impactEstimate: { label: "≈ water + energy saved", perUnitApprox: "≈ small daily savings" },
  },
  {
    id: "coldwash",
    title: "Cold-water laundry",
    description: "If you run laundry, try cold wash.",
    windows: ["anytime"],
    defaultDailyNudges: 1,
    unit: "loads",
    impactEstimate: { label: "≈ kWh saved", perUnitApprox: "≈ per load" },
  },
  {
    id: "unplug",
    title: "Unplug standby before bed",
    description: "Unplug one device on standby tonight.",
    windows: ["evening"],
    defaultDailyNudges: 1,
    unit: "count",
    impactEstimate: { label: "≈ standby reduced", perUnitApprox: "≈ 1 device" },
  },
  {
    id: "walk",
    title: "Walk/transit for a short trip",
    description: "If possible, swap one short drive today.",
    windows: ["commute", "anytime"],
    defaultDailyNudges: 1,
    unit: "trips",
    impactEstimate: { label: "≈ car trips avoided", perUnitApprox: "≈ 1 trip" },
  },
  {
    id: "utensils",
    title: "Refuse single-use utensils",
    description: "Skip disposable utensils once today.",
    windows: ["commute", "anytime"],
    defaultDailyNudges: 1,
    unit: "count",
    impactEstimate: { label: "≈ disposables avoided", perUnitApprox: "≈ 1 set" },
  },
];
