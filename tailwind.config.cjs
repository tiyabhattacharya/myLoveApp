/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{svelte,js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff5c7a',
        accent: '#ffd9e2',
        cream: '#fff6f8'
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        script: ['Dancing Script', 'cursive']
      }
    }
  },
  plugins: []
};
