/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export default {
  important: true,
  content: ['./**/*.{js,vue,ts}', '!./**/node_modules/**'],
  theme: {
    extend: {
      colors: {
        'text-color': 'rgb(var(--text-color) / <alpha-value>)',
        'text-color-inverse': 'var(--text-color-inverse)',
        'border-color': 'var(--border-color)',
        'background-color': 'var(--background-color)',
        'background-color-inverse': 'var(--background-color-inverse)',
        'link-hover': 'var(--link-hover)',
        'k-accent': 'var(--k-accent)',
        'k-accent2': 'var(--k-accent2)',
        'k-accent-light': 'var(--k-accent-light)',
        'k-accent-hover': 'var(--k-accent-hover)',
        'k-accent-light-2': 'var(--k-accent-light-2)',
        'k-accent-light-2-dark': 'var(--k-accent-light-2-dark)',
        'k-accent-light-2-dark-head': 'var(--k-accent-light-2-dark-head)',
        'k-accent-light-2-dark-paragraph':
          'var(--k-accent-light-2-dark-paragraph)',
        'k-accent-light-3': 'var(--k-accent-light-3)',
        'k-green': 'var(--k-green)',
        'k-green-light': 'var(--k-green-light)',
        'k-red': 'var(--k-red)',
        'k-orange': 'var(--k-orange)',
        'k-orange-light': 'var(--k-orange-light)',
        'k-orange2': 'var(--k-orange2)',
        'k-orange3': 'var(--k-orange3)',
        'k-orange4': 'var(--k-orange4)',
        'k-red-accent': 'var(--k-red-accent)',
        'k-red-accent-2': 'var(--k-red-accent-2)',
        'k-grey': 'var(--k-grey)',
        'k-grey-fix': 'var(--k-grey-fix)',
        'k-grey-light': 'rgb(var(--k-grey-light) / <alpha-value>)',
        'k-pink': 'var(--k-pink)',
        'k-yellow': 'var(--k-yellow)',
        'k-yellow-light': 'var(--k-yellow-light)',
        'k-blue-accent': 'var(--k-blue-accent)',
        'k-aqua-blue': 'var(--k-aqua-blue)',
        'k-green-accent': 'var(--k-green-accent)',
        'k-green-accent-2': 'var(--k-green-accent-2)',
        'k-hover-grey': 'var(--k-hover-grey)',
        'k-blue': 'var(--k-blue)',
        'k-blue-hover': 'var(--k-blue-hover)',
        'k-blue-light': 'var(--k-blue-light)',
        'k-primary': 'var(--k-primary)',
        'k-primary-light': 'var(--k-primary-light)',
        'k-shade': 'rgb(var(--k-shade) / <alpha-value>)',
        'k-shade2': 'var(--k-shade2)',
        'k-purple': 'var(--k-purple)',
        'k-purple-accent': 'var(--k-purple-accent)',
        'placeholder-color': 'var(--placeholder-color)',
        'disabled': 'var(--disabled)',
        'card-border-color': 'var(--card-border-color)',
        'card-border-color-light': 'var(--card-border-color-light)',
        'green-border-color': 'var(--green-border-color)',
        'blue-accent-bg-color': 'var(--blue-accent-bg-color)',
        'blue-light-hover-color': 'var(--blue-light-hover-color)',
        'separator-line-color': 'var(--separator-line-color)',
        'toggle-primary': 'var(--toggle-primary)',
        'toggle-active-switch': 'var(--toggle-active-switch)',
        'purple-light-color': 'var(--purple-light-color)',
        'purple-dark-color': 'var(--purple-dark-color)',
        'steps-active-color': 'rgb(var(--steps-active-color) / <alpha-value>)',

        'neutral': {
          1: '#ffffff',
          2: '#fcfcfc',
          3: '#f5f5f5',
          4: '#f0f0f0',
          5: '#d9d9d9',
          6: '#bfbfbf',
          7: '#8c8c8c',
          8: '#595959',
          9: '#454545',
          10: '#262626',
          11: '#1f1f1f',
          12: '#141414',
          13: '#000000',
        },
      },
      boxShadow: {
        primary: 'var(--primary-shadow)',
      },
      fontFamily: {
        inherit: 'inherit',
      },
      opacity: {
        'unset': 'unset',
        'card-hover-opacity': 'var(--card-hover-opacity)',
      },
      // TODO: remove it after removing .border class from global.scss
      borderWidth: {
        default: '1px',
      },
      lineHeight: {
        4.5: '1.125rem',
      },
      height: {
        13: '3.25rem',
      },
      animation: {
        'icon-spin':
          'icon-spin infinite linear var(--oruga-icon-spin-duration, 1s)',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      // TODO: remove it after removing bulma
      padding: {
        'tw-5': '1.25rem',
        'tw-8': '2rem',
        'button-x': 'calc(0.75em - 1px)',
        'button-y': 'calc(0.5em - 1px)',
      },
      fontSize: {
        '3xl': '2rem',
      },
      spacing: {
        'navbar-desktop': '80px', // $navbar-desktop-min-height
        'navbar-mobile': '64px', // $navbar-mobile-min-height
        'fluid-container-padding': '2.5rem',
        'fluid-container-padding-mobile': '1.25rem',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      // https://bulma.io/documentation/start/responsiveness/
      // https://bulma.io/documentation/sass/responsive-mixins/
      // Bulma prefixed breakpoints
      addVariant('bulma-mobile', '@media (max-width: 768px)')
      addVariant('bulma-tablet', '@media (min-width: 769px)')
      addVariant('bulma-desktop', '@media (min-width: 1024px)')
      addVariant('bulma-widescreen', '@media (min-width: 1216px)')
      addVariant('bulma-fullhd', '@media (min-width: 1408px)')

      // Bulma "-only" variants
      addVariant('bulma-tablet-only', '@media (min-width: 769px) and (max-width: 1023px)')
      addVariant('bulma-desktop-only', '@media (min-width: 1024px) and (max-width: 1215px)')
      addVariant('bulma-widescreen-only', '@media (min-width: 1216px) and (max-width: 1407px)')

      // Bulma "until-" variants
      addVariant('bulma-touch', '@media (max-width: 1215px)')
      addVariant('bulma-until-widescreen', '@media (max-width: 1215px)')
      addVariant('bulma-until-fullhd', '@media (max-width: 1407px)')
    }),
  ],
  corePlugins: {
    preflight: false,
  },
  darkMode: 'class',
}
