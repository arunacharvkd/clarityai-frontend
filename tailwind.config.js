/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#1f1f2e',
        surface: { DEFAULT: '#2a2a3f', 2: '#323250', 3: '#3d3d60' },
        accent: { DEFAULT: '#6366f1', 2: '#a78bfa' },
        success: '#34d399',
        warn: '#fbbf24',
        danger: '#f87171',
        info: '#22d3ee',
      },
    },
  },
  plugins: [],
};
