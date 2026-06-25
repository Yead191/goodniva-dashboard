/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B4EE6',
          light: '#EEE9FD',
          dark: '#5A3FD3',
        },
        brand: {
          accent: '#F97316',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          input: '#F1F5F9',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          text: '#065F46',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          text: '#92400E',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          text: '#991B1B',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
          text: '#1E40AF',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        line: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.06)',
        'card-hover': '0 8px 20px rgba(15,23,42,0.06)',
        modal: '0 20px 60px rgba(15,23,42,0.15)',
        toast: '0 4px 16px rgba(15,23,42,0.10)',
      },
    },
  },
  plugins: [],
}
