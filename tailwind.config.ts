import type { Config } from "tailwindcss";

// Design tokens live as CSS variables in app/globals.css; this file maps them to Tailwind.
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        "pond-deep": token("pond-deep"),
        pond: token("pond"),
        "pond-light": token("pond-light"),
        lily: token("lily"),
        petal: token("petal"),
        "petal-deep": token("petal-deep"),
        night: token("night"),
        "night-raised": token("night-raised"),
        cream: token("cream"),
        mist: token("mist"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        hero: ["clamp(3.25rem, 11vw, 8.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        title: ["clamp(2.25rem, 6vw, 3.75rem)", { lineHeight: "1", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      keyframes: {
        // Slow drifting light on the pond floor
        caustic: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(4%, -3%) scale(1.08)" },
        },
      },
      animation: {
        caustic: "caustic 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
