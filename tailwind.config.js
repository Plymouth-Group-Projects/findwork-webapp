/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darker: '#163950',
        dark: '#1c455f',
        light: '#1c829b',
        lightest: '#66b6c9',
        darkest: '#000414',
      },
      fontFamily: {
        bebas: "var(--font-bebas-neue)",
        lato: "var(--font-lato)",
      },
    },
  },
  plugins: [],
}

