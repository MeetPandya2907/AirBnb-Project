module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'airbnb': {
          DEFAULT: '#FF385C',
          'dark': '#E31C5F',
        },
      },
      fontFamily: {
        sans: ['Circular', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 