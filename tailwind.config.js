/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blink: 'blink 1.5s infinite', // Define la animación y su duración
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)', // Sube 10px
          },
          '100%': {
            transform: 'translateY(0)', // Baja nuevamente a la posición original
          },
        },

        blink: {
          '0%, 100%': { backgroundColor: 'rgb(243 106 6)' }, // bg-cyan-600
          '50%': { backgroundColor: 'rgb(242 163 105)' }, // bg-cyan-950
        },
      },
      backgroundImage: {
        'icono-portada': "url('/images/icono-expertis.png')",
        
      },
      fontFamily: {
        'montserrat': ['Montserrat'],
        'lato': ['Lato'],
        'garamond': ['Garamond'],
        'roboto': ['Roboto+Flex']
    }
    ,
    screens: {
      'xs': '425px', // Define un breakpoint para pantallas menores a 64px
      'xs2': '375px'
    },
    },
  },
  plugins: [],
}