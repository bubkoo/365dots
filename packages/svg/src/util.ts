export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

export function isWeekend(date: Date) {
  return date.getDay() === 6 || date.getDay() === 0
}
