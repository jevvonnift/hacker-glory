import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
        "rubik-bubbles": ["Rubik Bubbles", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
