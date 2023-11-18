/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './libs/ui/**/*.{js,vue,ts}',
    '!./**/node_modules/**',
  ],
  theme: {
    extend: {
      colors: {
        'text-color': 'rgb(var(--text-color) / <alpha-value>)',
        'text-color-inverse': 'rgb(var(--text-color-inverse) / <alpha-value>)',
        'border-color': 'rgb(var(--border-color) / <alpha-value>)',
        'background-color': 'rgb(var(--background-color) / <alpha-value>)',
        'background-color-inverse':
          'rgb(var(--background-color-inverse) / <alpha-value>)',
        'link-hover': 'rgb(var(--link-hover) / <alpha-value>)',
        'k-accent': 'rgb(var(--k-accent) / <alpha-value>)',
        'k-accent-light': 'rgb(var(--k-accent-light) / <alpha-value>)',
        'k-accent-hover': 'rgb(var(--k-accent-hover) / <alpha-value>)',
        'k-accent-light-2': 'rgb(var(--k-accent-light-2) / <alpha-value>)',
        'k-accent-light-2-dark':
          'rgb(var(--k-accent-light-2-dark) / <alpha-value>)',
        'k-accent-light-2-dark-head':
          'rgb(var(--k-accent-light-2-dark-head) / <alpha-value>)',
        'k-accent-light-2-dark-paragraph':
          'rgb(var(--k-accent-light-2-dark-paragraph) / <alpha-value>)',
        'k-green': 'rgb(var(--k-green) / <alpha-value>)',
        'k-red': 'rgb(var(--k-red) / <alpha-value>)',
        'k-orange': 'rgb(var(--k-orange) / <alpha-value>)',
        'k-red-accent': 'rgb(var(--k-red-accent) / <alpha-value>)',
        'k-red-accent-2': 'rgb(var(--k-red-accent-2) / <alpha-value>)',
        'k-grey': 'rgb(var(--k-grey) / <alpha-value>)',
        'k-grey-fix': 'rgb(var(--k-grey-fix) / <alpha-value>)',
        'k-pink': 'rgb(var(--k-pink) / <alpha-value>)',
        'k-yellow': 'rgb(var(--k-yellow) / <alpha-value>)',
        'k-blue-accent': 'rgb(var(--k-blue-accent) / <alpha-value>)',
        'k-aqua-blue': 'rgb(var(--k-aqua-blue) / <alpha-value>)',
        'k-green-accent': 'rgb(var(--k-green-accent) / <alpha-value>)',
        'k-green-accent-2': 'rgb(var(--k-green-accent-2) / <alpha-value>)',
        'k-hover-grey': 'rgb(var(--k-hover-grey) / <alpha-value>)',
        'k-blue': 'rgb(var(--k-blue) / <alpha-value>)',
        'k-blue-hover': 'rgb(var(--k-blue-hover) / <alpha-value>)',
        'k-blue-light': 'rgb(var(--k-blue-light) / <alpha-value>)',
        'k-primary': 'rgb(var(--k-primary) / <alpha-value>)',
        'k-primary-light': 'rgb(var(--k-primary-light) / <alpha-value>)',
        'k-shade': 'rgb(var(--k-shade) / <alpha-value>)',
        'placeholder-color': 'rgb(var(--placeholder-color) / <alpha-value>)',
        disabled: 'rgb(var(--disabled) / <alpha-value>)',
        'card-border-color': 'rgb(var(--card-border-color) / <alpha-value>)',
        'card-border-color-light':
          'rgb(var(--card-border-color-light) / <alpha-value>)',
        'green-border-color': 'rgb(var(--green-border-color) / <alpha-value>)',
        'blue-accent-bg-color':
          'rgb(var(--blue-accent-bg-color) / <alpha-value>)',
        'blue-light-hover-color':
          'rgb(var(--blue-light-hover-color) / <alpha-value>)',
        'card-hover-opacity': 'rgb(var(--card-hover-opacity) / <alpha-value>)',
        'separator-line-color':
          'rgb(var(--separator-line-color) / <alpha-value>)',
        'toggle-primary': 'rgb(var(--toggle-primary) / <alpha-value>)',
        'toggle-active-switch':
          'rgb(var(--toggle-active-switch) / <alpha-value>)',
      },
      boxShadow: {
        primary: 'var(--primary-shadow)',
      },
      fontFamily: {
        inherit: 'inherit',
      },
    },
  },
  plugins: [],
}
