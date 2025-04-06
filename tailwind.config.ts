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
      }
    }
  },
  plugins: [],
});

