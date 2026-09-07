/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          blue: "#4285F4",
          red: "#EA4335",
          yellow: "#FBBC05",
          green: "#34A853",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          bg: "#F8FAFC",
          hover: "#F1F3F4",
          selected: "#E8F0FE",
          border: "#DADCE0",
        },
        ink: {
          DEFAULT: "#202124",
          muted: "#5F6368",
        },
        dark: {
          bg: "#202124",
          surface: "#292A2D",
          surface2: "#303134",
          text: "#FFFFFF",
          muted: "#9AA0A6",
          border: "#3C4043",
        },
      },
      borderRadius: {
        card: "12px",
      },
      spacing: {
        4.5: "18px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};
