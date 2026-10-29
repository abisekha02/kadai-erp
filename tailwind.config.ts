import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#173D2B",
        forest: "#1F5138",
        terracotta: "#A64B28",
        clay: "#8E3F20",
        sand: "#EBC9A8",
        chalk: "#FFF9EC",
        saffron: "#F5A623",
        cream: "#FFFBF0",
        betel: "#2F6B4A",
        brick: "#A8322A",
        line: "#E6DCC3",
        mute: "#5F6B61",
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
