//
//  dateUtils.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//
export function startOfLocalDayISO(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isSameLocalDay(a, b) {
  return startOfLocalDayISO(a) === startOfLocalDayISO(b);
}

export function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function getLastNDays(n) {
  const days = [];
  const today = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    days.push({
      date: d,
      iso: startOfLocalDayISO(d),
      label: d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1),
      dayNumber: d.getDate(),
    });
  }

  return days;
}

export function isHourInQuietHours(hour, quietStartHour, quietEndHour) {
  if (quietStartHour === quietEndHour) return false;
  if (quietStartHour > quietEndHour) {
    return hour >= quietStartHour || hour < quietEndHour;
  }
  return hour >= quietStartHour && hour < quietEndHour;
}

export function getWindowHour(windowKey) {
  switch (windowKey) {
    case "morning":
      return 8;
    case "commute":
      return 17;
    case "evening":
      return 20;
    case "anytime":
    default:
      return 13;
  }
}

export function buildNextWindowDate(windowKey, now = new Date()) {
  const fireDate = new Date(now);
  fireDate.setMinutes(0, 0, 0);

  const hour = getWindowHour(windowKey);
  fireDate.setHours(hour, 0, 0, 0);

  if (fireDate <= now) {
    fireDate.setDate(fireDate.getDate() + 1);
  }

  return fireDate;
}

export function moveToNextNonQuietHour(date, quietStartHour, quietEndHour) {
  const d = new Date(date);

  while (isHourInQuietHours(d.getHours(), quietStartHour, quietEndHour)) {
    d.setHours(d.getHours() + 1, 0, 0, 0);
  }

  return d;
}
