import prettier from 'eslint-plugin-prettier'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import parser from 'vue-eslint-parser'
import path from 'node:path'

import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import { includeIgnoreFile } from '@eslint/compat'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  includeIgnoreFile(gitignorePath),
  {
    ignores: ['**/*.md'],
  },
  ...compat.extends(
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue-scoped-css/vue3-recommended',
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

    rules: {
      'no-empty-function': 'warn',
      'no-trailing-spaces': 'error',
      'unicorn/no-for-loop': 'error',

      'brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: false,
        },
      ],

      'no-restricted-syntax': [
        'error',
        {
          selector: 'IfStatement > :not(BlockStatement).consequent',
          message: 'Use blockstatement after if, please check STYLE_GUIDE.md',
        },
        {
          selector: 'ForStatement',
          message:
            'Use `forEach` or `for-of` for loop, please check STYLE_GUIDE.md',
        },
      ],

      'no-useless-catch': 1,
      'no-var': 'error',
      'linebreak-style': 0,

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      semi: ['error', 'never'],
      'max-classes-per-file': ['error', 2],

      'sort-imports': [
        'warn',
        {
          ignoreDeclarationSort: true,
          allowSeparatedGroups: true,
        },
      ],

      'vue/multi-word-component-names': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',
      'vue-scoped-css/v-deep-pseudo-style': ['error', ':deep'],
      'vue-scoped-css/no-deprecated-deep-combinator': 'error',
      'vue-scoped-css/require-v-deep-argument': 'error',
      'vue-scoped-css/no-unused-selector': 'off',
      'vue-scoped-css/enforce-style-type': 'off',
      'vue/no-dupe-keys': 'warn',
      'vue/require-toggle-inside-transition': 'warn',
    },
  },
  {
    files: [
      'layouts/**/*.{js,ts,vue}',
      'pages/**/*.vue',
      'components/**/*.{js,ts,vue}',
      'utils/**/*.ts',
      'stores/**/*.ts',
      'services/**/*.ts',
      'plugins/**/*.ts',
      'composables/**/*.ts',
    ],

    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '*.png',
                '*.jpg',
                '*.jpeg',
                '*.gif',
                '*.bmp',
                '*.svg',
                '*.webp',
              ],
              message:
                'It is recommended to utilize HTML tags and using a URL path, instead of directly importing images using JavaScript',
            },
          ],
        },
      ],
    },
  },
]
