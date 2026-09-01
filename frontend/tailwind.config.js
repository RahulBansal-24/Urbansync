/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#080B10",
          card: "#111620",
          panel: "#161C28",
          border: "#242E40",
          hover: "#1D2536",
          text: "#E2E8F0",
          muted: "#94A3B8"
        },
        cyan: {
          glow: "#00F0FF",
          brand: "#06B6D4"
        },
        purple: {
          brand: "#8B5CF6",
          glow: "#A855F7"
        },
        status: {
          live: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          critical: "#B91C1C",
          info: "#3B82F6"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.35)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.35)',
        'panel-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.7)'
      }
    },
  },
  plugins: [],
}
