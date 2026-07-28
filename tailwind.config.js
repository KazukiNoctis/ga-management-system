/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A' },
        accent: { DEFAULT: '#8B5CF6', 50: '#F5F3FF', 100: '#EDE9FE', 500: '#8B5CF6', 600: '#7C3AED' },
        success: { DEFAULT: '#10B981', 50: '#ECFDF5', 500: '#10B981', 600: '#059669' },
        warning: { DEFAULT: '#F59E0B', 50: '#FFFBEB', 500: '#F59E0B' },
        danger: { DEFAULT: '#EF4444', 50: '#FEF2F2', 500: '#EF4444', 600: '#DC2626' },
      },
    },
  },
  plugins: [],
};
