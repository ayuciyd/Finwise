/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finwise: {
          green: '#1B5E3B',
          medium: '#2D7A52',
          mint: '#E8F0ED',
          navy: '#1B2A4A',
          yellow: '#F5F0C0',
          amber: '#F5A623',
          red: '#A32D2D',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
