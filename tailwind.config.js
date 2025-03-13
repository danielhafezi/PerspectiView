/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Emotion colors defined in the PRD
        emotion: {
          anger: '#e53e3e',    // red
          joy: '#ecc94b',      // yellow
          fear: '#805ad5',     // purple
          sadness: '#4299e1',  // blue
          surprise: '#ed8936', // orange
          disgust: '#68d391',  // green
          neutral: '#a0aec0',  // gray
        }
      }
    },
  },
  plugins: [],
} 