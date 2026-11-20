/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#ff5722',
          red: '#ff3d00',
          deepOrange: '#e64a19',
          peach: '#fff3ed',
          whatsapp: '#25D366',
          whatsappHover: '#20ba5a',
          dark: '#101827',
          gray: {
            light: '#F8FAFC',
            border: '#E2E8F0',
            text: '#64748B'
          }
        }
      },
      borderRadius: {
        'card': '16px'
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(255, 87, 34, 0.12)'
      }
    },
  },
  plugins: [],
}
