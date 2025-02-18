/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'primary': {
          DEFAULT: '#2563eb', // Blue
          'light': '#3b82f6',
          'dark': '#1d4ed8',
        },
        // Background colors
        'app-bg': {
          DEFAULT: '#f8fafc', // Light mode
          'dark': '#0f172a',  // Dark mode
        },
        // Surface colors
        'surface': {
          DEFAULT: '#ffffff',
          'dark': '#1e293b',
          'darker': '#0f172a',
        },
        // Accent colors
        'accent': {
          DEFAULT: '#7c3aed', // Purple
          'light': '#8b5cf6',
          'dark': '#6d28d9',
        },
        // Text colors
        'text': {
          DEFAULT: '#1e293b',
          'light': '#64748b',
          'dark': '#f8fafc',
          'dark-light': '#cbd5e1',
        },
        // Status colors
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',
      },
    },
  },
  plugins: [],
} 