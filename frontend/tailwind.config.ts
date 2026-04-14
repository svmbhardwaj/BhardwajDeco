import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        mist: "#f6f6f4",
        gold: "#C5A46D",
        "gold-light": "#d5b881",
        "gold-dim": "rgba(197, 164, 109, 0.15)"
      },
      fontFamily: {
        sans: ["Inter", "Avenir Next", "Helvetica Neue", "sans-serif"],
        display: ["Playfair Display", "Georgia", "Times New Roman", "serif"]
      },
      boxShadow: {
        soft: "0 16px 40px -20px rgba(0,0,0,0.24)",
        glow: "0 0 30px rgba(197, 164, 109, 0.2)",
        "glow-lg": "0 0 60px rgba(197, 164, 109, 0.15)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(0,0,0,0.02) 0, rgba(0,0,0,0.01) 35%, rgba(0,0,0,0) 60%)"
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        }
      }
    }
  },
  plugins: []
};

export default config;
