import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'accent-1': 'var(--accent-1)',
        'accent-2': 'var(--accent-2)',
        'accent-3': 'var(--accent-3)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: 'var(--card)',
        border: 'var(--border)',
      },
      backgroundColor: {
        'background/50': 'rgba(10, 10, 15, 0.5)',
      },
      boxShadow: {
        'primary-sm': '0 2px 4px var(--primary-shadow)',
        'primary-md': '0 4px 6px var(--primary-shadow)',
        'primary-lg': '0 10px 15px var(--primary-shadow)',
      }
    },
  },
  plugins: [],
} satisfies Config;
