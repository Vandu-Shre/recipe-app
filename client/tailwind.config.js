// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Crucial for scanning your React components
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ['Inter', 'Lora', 'serif'],
      }
    },
  },
  plugins: [],
};