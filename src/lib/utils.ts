import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_ANNOUNCEMENT_BODY = JSON.stringify([
  {
    id: "de085bb8-a494-4c74-93eb-b38db443506a",
    type: "paragraph",
    props: {
      textColor: "default",
      backgroundColor: "default",
      textAlignment: "left",
    },
    content: [
      {
        type: "text",
        text: "Haiii mau menulis pengumuman apa hari ini!!!",
        styles: {},
      },
    ],
    children: [],
  },
]);

export const getDay = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // Month is 0-indexed
  const day = date.getUTCDate();
  return `${year}-${month < 10 ? "0" : ""}${month}-${
    day < 10 ? "0" : ""
  }${day}`;
};

export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
