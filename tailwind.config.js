/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#E6F1FB',
          100: '#B5D4F4',
          200: '#85B7EB',
          400: '#378ADD',
          500: '#185FA5',
          600: '#0C447C',
          700: '#042C53',
        },
        success: { light: '#EAF3DE', DEFAULT: '#3B6D11', dark: '#27500A' },
        warning: { light: '#FAEEDA', DEFAULT: '#854F0B', dark: '#633806' },
        danger:  { light: '#FCEBEB', DEFAULT: '#A32D2D', dark: '#791F1F' },
        purple:  { light: '#EEEDFE', DEFAULT: '#534AB7', dark: '#3C3489' },
        teal:    { light: '#E1F5EE', DEFAULT: '#0F6E56', dark: '#085041' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-dot': 'bounce 1.2s infinite',
      }
    },
  },
  plugins: [],
}
