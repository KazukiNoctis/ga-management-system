/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        'background': '#f7f9fb',
        'surface': '#f7f9fb',
        'surface-dim': '#d8dadc',
        'surface-bright': '#f7f9fb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-highest': '#e0e3e5',
        'surface-variant': '#e0e3e5',
        'surface-tint': '#4059aa',

        // On-surface
        'on-surface': '#191c1e',
        'on-surface-variant': '#444651',
        'on-background': '#191c1e',

        // Primary
        'primary': '#00236f',
        'on-primary': '#ffffff',
        'primary-container': '#1e3a8a',
        'on-primary-container': '#90a8ff',
        'primary-fixed': '#dce1ff',
        'primary-fixed-dim': '#b6c4ff',
        'on-primary-fixed': '#00164e',
        'on-primary-fixed-variant': '#264191',

        // Secondary
        'secondary': '#505f76',
        'on-secondary': '#ffffff',
        'secondary-container': '#d0e1fb',
        'on-secondary-container': '#54647a',
        'secondary-fixed': '#d3e4fe',
        'secondary-fixed-dim': '#b7c8e1',
        'on-secondary-fixed': '#0b1c30',
        'on-secondary-fixed-variant': '#38485d',

        // Tertiary (success green)
        'tertiary': '#00311f',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#004a31',
        'on-tertiary-container': '#27c38a',
        'tertiary-fixed': '#6ffbbe',
        'tertiary-fixed-dim': '#4edea3',
        'on-tertiary-fixed': '#002113',
        'on-tertiary-fixed-variant': '#005236',

        // Error
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // Outline
        'outline': '#757682',
        'outline-variant': '#c5c5d3',

        // Inverse
        'inverse-surface': '#2d3133',
        'inverse-on-surface': '#eff1f3',
        'inverse-primary': '#b6c4ff',

        // Semantic aliases for convenience
        'success': { DEFAULT: '#10B981', 50: '#ECFDF5', 500: '#10B981', 600: '#059669' },
        'warning': { DEFAULT: '#F59E0B', 50: '#FFFBEB', 500: '#F59E0B' },
        'danger': { DEFAULT: '#EF4444', 50: '#FEF2F2', 500: '#EF4444', 600: '#DC2626' },
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px',
      },
      spacing: {
        'stack-xs': '0.25rem',
        'stack-sm': '0.5rem',
        'stack-md': '1rem',
        'stack-lg': '1.5rem',
        'margin-mobile': '1rem',
        'margin-desktop': '2rem',
        'gutter': '1.5rem',
        'container-max': '1440px',
      },
    },
  },
  plugins: [],
};
