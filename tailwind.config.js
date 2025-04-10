/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        sidebar: {
          DEFAULT: "#083868",
          foreground: "white",
          primary: "white",
          "primary-foreground": "white",
          accent: "white",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        brand: {
          50: "#e6eff7",
          100: "#c0d7e8",
          200: "#99bedd",
          300: "#73a6d2",
          400: "#4c8dc6",
          500: "#083868",
          600: "#1e4f80",
          700: "#16395f",
          800: "#0e243e",
          900: "#06111f",
          main: "#083868",
        },
      },
      fontFamily: {
        sans: "'Inter Variable', sans-serif",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
