/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1D3E21',
        'content': '#4A4A4A',
        'secondary': '#FFFFFF',
        'accent': '#2A5A2E',
        'supporting': '#122514',
        'nebula-1': '#FF6B6B',
        'nebula-2': '#4ECDC4',
        'nebula-3': '#45B7D1',
        'nebula-4': '#96CEB4'
      }
    },
  },
  plugins: [],
}