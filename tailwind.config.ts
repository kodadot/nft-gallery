import type { Config } from 'tailwindcss'

export default {
  presets: [require('@kodadot1/brick/tailwind.config')],
  darkMode: ['class', '.dark-mode'],
} as Partial<Config>
