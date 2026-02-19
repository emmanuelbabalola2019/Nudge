# Nudge
Self Project

 Sustainable Habit Nudges – MVP Product Spec

 1) One‑line pitch

Tiny, contextual nudges that help people stick to 1–2 sustainable habits at a time.

 2) Problem & hypothesis

Problem: Climate action feels overwhelming; people abandon complex trackers. Small, consistent habits compound but are hard to maintain without timely prompts.
Hypothesis: If we limit focus to 1–2 habits, send lightweight nudges at the *right moments*, and celebrate micro‑wins, users will keep streaks and reduce waste/energy use.

3) Target users & JTBD

Personas:

  Busy professional who wants to be greener without extra cognitive load.
  Student looking for simple, social sustainability challenges.
  Parent teaching kids eco‑habits at home.
Jobs to be done (top):

   “Remind me at the right time to do a small eco‑habit.”
   “Show me my streak so I stay motivated.”
   “Give me one simple action I can actually do today.”

 4) Core user loop

1. Pick 1–2 habits from a curated library (e.g., “Bring a bottle”, “Meat‑free lunch”, “Lights off when leaving”).
2. Get “contextual nudges” (time‑based + optional location/device context).
3. Mark done (one‑tap). Optionally add a note/photo.
4. See streaks and cumulative impact (lightweight stats).
5. After 7/14/30 days, graduate a habit or keep it.

5) MVP scope (V1)

Must‑have

 Onboarding with 5–8 curated habits; select up to 2.
 Nudge scheduler: 1–3 nudges/day per active habit (smart spacing).
 One‑tap completion via push deep‑link.
 Streaks, weekly view, simple impact equivalents (e.g., bottles avoided, kWh saved – rough but conservative).
 Privacy-first settings (local storage by default; optional account).
 iOS/Android via React Native (or Expo) + lightweight backend.

Nice‑to‑have (stretch)

Geofenced nudges (e.g., near grocery store: “bring bags next time”).
 Social mini‑challenges (friends, classroom code).
Widget/lock‑screen quick mark.

Non‑goals (V1)
Marketplace, brand partnerships, complex carbon accounting.
Broad habit catalog (>30), custom habit creation.

 6) Nudge logic (V1)

Each habit defines “preferred windows” (e.g., “morning commute”, “evening home”).
For each active habit, schedule N = 1–2 nudges from windows not used in last 36h.
Respect quiet hours (default 9pm–7am local).
Cooldown: after completion: no more nudges for that habit until the next day.
Adaptive: If the user ignores 3 nudges in a row, reduce frequency by 30% until a completion.

 Pseudocode

```
for habit in active_habits(user):
  if completed_today(habit): continue
  if ignored_streak(habit) >= 3: freq = base_freq * 0.7 else: freq = base_freq
  slots = available_time_windows(habit, user_prefs)
  slots = dedupe_recent(slots, horizon=36h)
  schedule = sample(slots, k=freq)
  push(schedule, habit)
```

 7) Habit library (seed set)

* Bring a reusable bottle (goal: 1/day)
* Lights off when leaving last room (goal: 1/evening)
* Meat‑free lunch (goal: 1/day)
* Shorter shower (<5 min) (goal: 1/day)
* Cold‑water laundry (goal: 1/week)
* Unplug/standby cut (goal: 1/evening)
* Public transit/walk for short trip (goal: 1/day)
* Refuse single‑use utensils (goal: 1/day)

Each habit has: `id, title, description, suggested_windows, default_freq, unit, impact_estimate`.

 8) Impact estimates (display only)

Bottle avoided: 1 plastic bottle ≈ ~30–100 g CO₂e (show as “~0.05 kg”).
Shorter shower:Save ~10–30 L and ~0.3 kWh per minute less (show “~1–2 kWh/week”).
Cold wash: Save *~0.6–1.5 kWh* per load.
  (Use conservative ranges; include a “≈” disclaimer.)

 9) UX sketches (behavior)

Home: Today’s 2 habits with big check buttons; streak badges on cards.
Nudge: Push text → deep‑links to habit card with single “Done” + optional “Snooze 30m”.
Stats: Week grid (Mon–Sun), total completions, small impact equivalents.
Settings: Quiet hours, nudge frequency, habit swap.

 10) Tech stack

App: React Native + Expo Notifications; AsyncStorage for local state; optional sign‑in via Firebase Auth (email/Apple/Google).
Backend: Cloudflare Workers or Firebase Functions for scheduled jobs + Firestore (or Supabase) for accounts/sync.
Analytics: Privacy‑respecting (PostHog self-host or Firebase Analytics with IP anonymization).
Push: Expo Push (V1) → APNs/FCM.

 11) Data model (sketch)

```
users: { id, tz, created_at, prefs: {quiet_start, quiet_end, max_per_day} }
habits: { id, title, desc, windows: [morning, commute, evening], default_freq, unit, impact_estimate }
user_habits: { user_id, habit_id, active: bool, started_at, streak, last_done_at, ignored_streak }
completions: { id, user_id, habit_id, ts, note? }
schedules: { id, user_id, habit_id, ts, status: queued|sent|clicked }
```

 12) API (minimal)

 `POST /signup` { email? }
 `GET /habits`
 `POST /user/habits` { habit_id }
 `POST /complete` { habit_id }
 `POST /snooze` { habit_id, minutes }
 `POST /prefs` { quiet_hours, freq }

 13) Notifications copy (examples)

 “Small win time: bring your bottle today?”
 “Lights off = tiny climate victory. Want to mark it?”
 “Try a meat‑free lunch? Your streak is at 3 🔥”
 “Quick eco‑nudge: can you unplug standby before bed?”
 “Skipped a few? No stress—one tap gets you back on track.”

14) Metrics & targets (first 4–6 weeks)

D1 retention ≥ 40%, W1 retention ≥ 20%
 Avg daily completions per active user ≥ 1.2
 Nudge open rate ≥ 20%
 7‑day streak achievers ≥ 15%

15) Privacy & safety

 Default **local‑only** mode: all data on device; cloud sync optional.
 No location by default; geofencing only with explicit opt‑in.
 Clear data export/delete; no 3rd‑party ad SDKs.

 16) Monetization (later)

 Free core. Pro: advanced stats, home widgets, habit library expansion, classroom codes.
 Mission‑aligned sponsors (non‑intrusive challenges), if ever.

 17) Delivery plan

 Week 1: UX flows + habit library + local state.
 Week 2: Push notifications + scheduling logic.
 Week 3: Streaks/stats + polish, TestFlight/Closed track.
 Week 4: Beta with 20–50 users, adjust nudge timing.

 18) Test script (beta)

 Onboard (choose 2 habits); verify pushes respect quiet hours.
 Ignore 3 nudges → frequency reduces.
 Complete → next‑day cooldown works.
 Swap habit → schedules update within 5 minutes.

 19) Risk & mitigations

Notification fatigue: cap per‑day, adaptive frequency.
Fuzzy impact numbers: show as ranges with disclaimer.
Low motivation: focus on streaks and tiny wins, not guilt.

20) Future roadmap

 Dynamic context (calendar, weather AQI) via user opt‑ins.
 Social mini‑leagues; school challenges.
*Wearable tap‑to‑complete (watchOS/Widgets).



