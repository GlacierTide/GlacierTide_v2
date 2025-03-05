/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx,css}",
    "./public/**/*.{html,js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(210 40% 98%)',
        foreground: 'hsl(222 47% 11%)',
        border: 'hsl(210 31% 93%)',
        input: 'hsl(214 32% 91%)',
        ring: 'hsl(222 47% 11%)',
        
        primary: {
          DEFAULT: 'hsl(210 60% 48%)',
          foreground: 'hsl(210 40% 98%)',
        },
        
        secondary: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(222 47% 11%)',
        },
        
        muted: {
          DEFAULT: 'hsl(210 40% 96%)',
          foreground: 'hsl(215 16% 47%)',
        },
        
        glacier: {
          50: 'hsl(206 100% 97%)',
          100: 'hsl(206 100% 95%)',
          200: 'hsl(206 94% 87%)',
          300: 'hsl(206 94% 77%)',
          400: 'hsl(206 94% 67%)',
          500: 'hsl(206 94% 57%)',
          600: 'hsl(206 94% 47%)',
          700: 'hsl(206 94% 37%)',
          800: 'hsl(206 94% 27%)',
          900: 'hsl(206 94% 17%)',
        },
        
        ice: {
          50: 'hsl(210 40% 98%)',
          100: 'hsl(210 40% 96%)',
          200: 'hsl(210 40% 94%)',
          300: 'hsl(210 40% 92%)',
          400: 'hsl(210 40% 90%)',
          500: 'hsl(210 40% 88%)',
          600: 'hsl(210 40% 86%)',
          700: 'hsl(210 40% 84%)',
          800: 'hsl(210 40% 82%)',
          900: 'hsl(210 40% 80%)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'page-transition-in': 'pageTransitionIn 0.3s ease-out',
      },
      keyframes: {
        pageTransitionIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(10px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        }
      }
    },
  },
  plugins: [],
}