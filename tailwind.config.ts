import type { Config } from "tailwindcss";

// Design tokens live as CSS variables in app/globals.css; this file maps them to Tailwind.
const token = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        desktop: token("desktop"),
        face: token("face"),
        "face-shadow": token("face-shadow"),
        "title-from": token("title-from"),
        "title-to": token("title-to"),
        select: token("select"),
        ink: token("ink"),
        amp: token("amp"),
        "amp-light": token("amp-light"),
        "amp-dark": token("amp-dark"),
        lcd: token("lcd"),
        "lcd-bg": token("lcd-bg"),
        "lcd-dim": token("lcd-dim"),
        "p-teal": token("p-teal"),
        "p-pink": token("p-pink"),
        "p-blue": token("p-blue"),
        "p-purple": token("p-purple"),
        screen: token("screen"),
        "screen-raised": token("screen-raised"),
        foreground: token("foreground"),
        muted: token("muted"),
        paper: token("paper"),
      },
      fontFamily: {
        // System fonts only for UI: zero download, and Verdana/Tahoma *is* the Y2K web.
        ui: ["Verdana", "Tahoma", "Geneva", "sans-serif"],
        display: ['"Arial Black"', '"Arial Bold"', "Gadget", "Impact", "sans-serif"],
        hand: ['"Comic Sans MS"', '"Chalkboard SE"', '"Comic Neue"', "cursive"],
        lcd: ["var(--font-lcd)", "ui-monospace", "monospace"],
      },
      fontSize: {
        hero: ["clamp(2.6rem, 8vw, 5.5rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "album-title": ["clamp(1.9rem, 5vw, 3.75rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
      },
      keyframes: {
        // 21st.dev / Magic UI marquee
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        // Spectrum-analyzer bar
        viz: {
          "0%, 100%": { transform: "scaleY(0.15)" },
          "25%": { transform: "scaleY(0.9)" },
          "50%": { transform: "scaleY(0.4)" },
          "75%": { transform: "scaleY(0.75)" },
        },
        blink: { "50%": { opacity: "0" } },
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        viz: "viz var(--viz-speed, 0.9s) ease-in-out infinite",
        blink: "blink 1s steps(1) infinite",
        "spin-slow": "spin 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
