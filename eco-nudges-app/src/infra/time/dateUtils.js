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
