import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import parser from 'vue-eslint-parser'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import unicorn from 'eslint-plugin-unicorn'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['**/node_modules', '**/coverage', '**/dist'],
  },
  ...compat.extends(
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ),
  {
    plugins: {
      prettier,
      '@typescript-eslint': typescriptEslint,
      unicorn,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: parser,
      ecmaVersion: 2022,
      sourceType: 'module',

      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.vue'],
  },
]
