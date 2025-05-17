export function strToDate(str: string) {
  return new Date(str);
}

export function strToFormattedDateTime(str: string) {
  return strToDate(str).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
}
