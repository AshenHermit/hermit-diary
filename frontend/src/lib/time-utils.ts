export const monthsTitles = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function strToDate(str: string) {
  return new Date(str);
}

export function strToFormattedDateTime(str: string) {
  return strToDate(str).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
}
