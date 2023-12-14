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
