/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← ADD THIS LINE
  
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Warm Golden Yellow / Amber
        primary: {
          50: '#FFF9EB',
          100: '#FFF1D6',
          200: '#FFE6B3',
          300: '#FFD36A',
          400: '#FFC857',
          500: '#F5B942',
          600: '#E0A12C',
          700: '#C98C1C',
          800: '#A3710F',
          900: '#7A5C3E',
          DEFAULT: '#F5B942',
          foreground: '#2B1D12',
        },
        // Secondary: Soft Cream / Off-White
        secondary: {
          50: '#FFFDFA',
          100: '#FAF7F2',
          200: '#FFF4E0',
          300: '#F5EDDC',
          400: '#EEE5D5',
          500: '#E6DCCB',
          DEFAULT: '#FAF7F2',
          foreground: '#2B1D12',
        },
        // Accent: Deep Brown / Chocolate
        accent: {
          50: '#F5F0EB',
          100: '#E8DDD5',
          200: '#D4C3B5',
          300: '#B89F8A',
          400: '#9C7D65',
          500: '#7A5C3E',
          600: '#5C452D',
          700: '#4A2E1F',
          800: '#3B2A1A',
          900: '#2B1D12',
          DEFAULT: '#4A2E1F',
          foreground: '#FAF7F2',
        },
        // Muted Background: Light Peach / Sand
        muted: {
          50: '#FFFDF9',
          100: '#FFF9F0',
          200: '#FFF1D6',
          300: '#FFE6B3',
          400: '#FFDBA3',
          500: '#FFD194',
          DEFAULT: '#FFF1D6',
          foreground: '#7A5C3E',
        },
        // Text Colors
        text: {
          primary: '#2B1D12',
          secondary: '#7A5C3E',
          muted: '#9C7D65',
        },
        // Background Colors
        background: {
          DEFAULT: '#F5F1E8',
          paper: '#FEFCF8',
          subtle: '#F9F5EC',
          card: '#FFFFFF',
          sidebar: '#F8F4E9',
        },
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 6px 30px 0 rgba(0, 0, 0, 0.08)',
        'glow': '0 0 15px rgba(245, 185, 66, 0.3)',
      },
      backgroundImage: {
        'gradient-golden': 'linear-gradient(135deg, #F5B942 0%, #FFD36A 50%, #FFF1D6 100%)',
        'gradient-subtle': 'linear-gradient(to bottom right, #F9F5EC 0%, #F5F1E8 50%, #F0ECE0 100%)',
        'gradient-cream': 'linear-gradient(to bottom, #FFFFFF 0%, #FEFCF8 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #F5B942 0%, #FFC857 50%, #FFD36A 100%)',
        'gradient-app': 'linear-gradient(135deg, #F9F5EC 0%, #F5F1E8 50%, #F0ECE0 100%)',
        'gradient-card': 'linear-gradient(to bottom, #FFFFFF 0%, #FEFCF8 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        'gradient-dark-card': 'linear-gradient(to bottom, #2d2d2d 0%, #1a1a1a 100%)',
      },
      animation: {
        'lift': 'lift 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale': 'scale 0.2s ease-out',
      },
      keyframes: {
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};