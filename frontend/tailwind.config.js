/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        code: ['"Source Code Pro"', 'monospace'],
      },
    },
  },
  // The 'plugins' array should be here, outside the 'theme' object
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography')
  ],
}