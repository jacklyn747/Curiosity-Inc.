import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#080808",
        obsidian: "#0f0f0f",
        surface: "#141414",
        "surface-2": "#1a1a1a",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E2C47A",
          dim: "#7A6430",
        },
        cream: "#F0E6D3",
        "cream-dim": "#A89880",
        bone: "#D4C4AA",
        smoke: "rgba(240,230,211,0.06)",
        "smoke-md": "rgba(240,230,211,0.12)",
        "smoke-lg": "rgba(240,230,211,0.20)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(5rem,10vw,12rem)", { lineHeight: "0.92", letterSpacing: "-0.04em" }],
        "display-xl": ["clamp(3.5rem,7vw,9rem)", { lineHeight: "0.94", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem,5vw,6rem)", { lineHeight: "0.96", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem,3.5vw,4rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.5rem,2.5vw,2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "label": ["0.6875rem", { lineHeight: "1", letterSpacing: "0.2em" }],
        "label-lg": ["0.75rem", { lineHeight: "1", letterSpacing: "0.25em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "section": "clamp(6rem,12vw,10rem)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in": "cubic-bezier(0.7, 0, 0.84, 0)",
        "circ-out": "cubic-bezier(0, 0.55, 0.45, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "grain": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-1%, -2%)" },
          "20%": { transform: "translate(1%, 1%)" },
          "30%": { transform: "translate(-2%, 0%)" },
          "40%": { transform: "translate(0%, 2%)" },
          "50%": { transform: "translate(2%, -1%)" },
          "60%": { transform: "translate(-1%, 2%)" },
          "70%": { transform: "translate(1%, -2%)" },
          "80%": { transform: "translate(-2%, 1%)" },
          "90%": { transform: "translate(2%, 0%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.6s ease both",
        "shimmer": "shimmer 2.5s linear infinite",
        "grain": "grain 0.4s steps(1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
