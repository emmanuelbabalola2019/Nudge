//
//  dateUtils.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//

export function startOfLocalDayISO(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Use the date portion as a stable local-day key:
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isSameLocalDay(a, b) {
  return startOfLocalDayISO(a) === startOfLocalDayISO(b);
}
