import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213D",
        turmeric: "#F2B705",
        chalk: "#F6F6F2",
        betel: "#2F6B4F",
        brick: "#B3392E",
        line: "#D9D9D0",
        mute: "#5B6275",
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', "Palatino", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
