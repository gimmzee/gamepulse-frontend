/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gaming: {
          dark: "#0a0e1a",
          darker: "#060912",
          card: "#111827",
          border: "#1f2937",
          accent: "#3b82f6",
          "accent-hover": "#2563eb",
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          green: "#10b981",
          red: "#ef4444",
          yellow: "#f59e0b",
          text: "#e2e8f0",
          muted: "#94a3b8",
        },
      },
      backgroundImage: {
        "gaming-gradient":
          "linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #0a0e1a 100%)",
        "card-gradient":
          "linear-gradient(145deg, #111827 0%, #1a2234 100%)",
        "accent-gradient":
          "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      },
      boxShadow: {
        "gaming-card": "0 4px 20px rgba(59, 130, 246, 0.1)",
        "gaming-hover": "0 8px 32px rgba(59, 130, 246, 0.25)",
        "gaming-glow": "0 0 20px rgba(59, 130, 246, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
