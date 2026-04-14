tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A',
          50: '#E8ECFB',
          100: '#C5CFF5',
          200: '#8B9EEB',
          300: '#526DE0',
          400: '#2545D6',
          500: '#0F172A',
          600: '#0D1424',
          700: '#0A101C',
          800: '#070B14',
          900: '#04060B',
        },
        secondary: {
          DEFAULT: '#F8FAFC',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#F8FAFC',
          300: '#E2E8F0',
          400: '#CBD5E1',
          500: '#94A3B8',
          600: '#64748B',
          700: '#475569',
          800: '#334155',
          900: '#1E293B',
        },
        accent: {
          DEFAULT: '#6D28D9',
          50: '#F5F0FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out infinite 2s',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.12)',
        'glass-lg': '0 24px 64px rgba(0,0,0,0.18)',
        'accent': '0 0 40px rgba(109,40,217,0.35)',
        'accent-sm': '0 0 20px rgba(109,40,217,0.25)',
        'primary': '0 8px 32px rgba(15,23,42,0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
      }
    }
  },
  plugins: [],
};
