import { withUt } from "uploadthing/tw";

export default withUt({
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darker: '#163950',
        dark: '#1c455f',
        light: '#1c829b',
        lightest: '#66b6c9',
        darkest: '#000414',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      fontFamily: {
        bebas: 'var(--font-bebas-neue)',
        lato: 'var(--font-lato)'
      },
      keyframes: {
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'slide-down': 'slide-down 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'scale-up': 'scale-up 0.3s ease-out forwards',
        'slide-down-delay-1': 'slide-down 0.3s ease-out 0.1s forwards',
        'slide-down-delay-2': 'slide-down 0.3s ease-out 0.15s forwards',
        'slide-down-delay-3': 'slide-down 0.3s ease-out 0.2s forwards',
        'slide-down-delay-4': 'slide-down 0.3s ease-out 0.25s forwards',
        'slide-down-delay-5': 'slide-down 0.3s ease-out 0.3s forwards',
      }
    }
  },
  plugins: [],
});

