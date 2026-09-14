import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#e7e6e2",
        surface: "#ffffff",
        ink: {
          DEFAULT: "#0a0a0a",
          2: "#8e8e93",
          3: "#c7c7cc",
        },
        border: "#ececea",
        accent: {
          DEFAULT: "#2f6fed",
          soft: "#eaf1fe",
        },
        urgent: {
          DEFAULT: "#d1442e",
          soft: "#fbeae6",
        },
        income: "#1fd17b",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "var(--font-inter)",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "16px",
        pill: "9999px",
      },
      boxShadow: {
        glass: "0 1px 1px rgba(255,255,255,.6) inset, 0 10px 28px rgba(31,38,66,.10)",
        floating: "0 16px 36px rgba(10,10,18,.28)",
      },
    },
  },
  plugins: [],
};

export default config;
