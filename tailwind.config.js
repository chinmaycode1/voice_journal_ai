/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        accent: '#7C6FFF',
        accent2: '#FF6B9D',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #7C6FFF 0%, #FF6B9D 100%)',
      },
    },
  },
  plugins: [],
}
