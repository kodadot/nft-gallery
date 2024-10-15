// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
).overrideRules({
  // General
  'no-useless-escape': 'warn',

  // Vue
  'vue/multi-word-component-names': 'off',
  'vue/no-multiple-template-root': 'warn',
})
