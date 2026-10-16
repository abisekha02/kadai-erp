import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2B1B12",
        wood: "#3A2216",
        turmeric: "#E8A200",
        chalk: "#FBF6EA",
        cream: "#FFF8E7",
        betel: "#2E6B3C",
        brick: "#B3261E",
        line: "#E4D8BF",
        mute: "#6B5A4A",
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', "Palatino", "Georgia", "serif"],
        tamil: ['"Noto Sans Tamil"', '"Nirmala UI"', "Latha", '"Tamil Sangam MN"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
