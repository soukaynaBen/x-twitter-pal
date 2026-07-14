/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./**/*.{ts,tsx}", "app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        "x-twitter":{
              "bg": "var(--x-twitter-bg:)",
              "panel": "var(--x-twitter-panel)",
              "panel-raised": "var(--x-twitter-panel-raised)",
              "border": "var(--x-twitter-border)",
              "text": "var(--x-twitter-text)",
              "text-dim": "var(--x-twitter-text-dim)",
              "accent": "var(--x-twitter-accent)",
              "accent-hover": "var(--x-twitter-accent-hover)",
              "danger": "var(--x-twitter-danger)",
              "danger-hover": "var(--x-twitter-danger-hover)",
              "danger-bg": "var(--x-twitter-danger-bg)",
              "border-second": "var(--x-twitter-border-second)",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
           "x-twitter-lg": `var( --x-twitter-radius)`,
           "x-twitter-md": `calc(var( --x-twitter-radius) - 4px)`,
           "x-twitter-sm": "calc(var( --x-twitter-radius) - 6px)"
      
      },
        fontFamily: {
        custom: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial","sans-serif"], 
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
