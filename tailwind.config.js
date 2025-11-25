import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.700'),
          },
        },
      }),
      fontFamily: {
        sans: ['"Noto Sans SC"', 'Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
        serif: ['"Lora"', '"Noto Serif SC"', 'serif'],
      },
    },
  },
  plugins: [
    typography,
  ],
}