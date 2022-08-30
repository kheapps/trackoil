export function formatLastMajDate(date: Date): string {
  // console.log("parse date format", date);
  if (isNaN(date?.valueOf())) return "NC";
  return date.toLocaleDateString() + " à " + date.toLocaleTimeString();
}
