// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
).overrideRules({
  '@typescript-eslint/no-explicit-any': 'warn',
  'vue/multi-word-component-names': 'off',
  'vue/no-multiple-template-root': 'warn',
  'no-useless-escape': 'warn',
})
