import type { Coordinates } from "./custom_types";

export function formatLastMajDate(date: Date): string {
  // console.log("parse date format", date);
  if (isNaN(date?.valueOf())) return "NC";
  return date.toLocaleDateString() + " à " + date.toLocaleTimeString();
}

export function coordinatesToString(coordinates: Coordinates): string {
  // console.log(coordinates);
  return coordinates.lat + "," + coordinates.long;
}
