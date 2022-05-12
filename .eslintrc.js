module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 11,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', 'prettier', '@typescript-eslint', 'unicorn'],
  rules: {
    'no-trailing-spaces': 'error',
    'unicorn/no-for-loop': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'IfStatement > :not(BlockStatement).consequent',
        message: 'Use blockstatement after if, please check STYLE_GUIDE.md',
      },
    ],
    'no-useless-catch': 1,
    'no-var': 'error',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'max-classes-per-file': ['error', 2],
  },
  ignorePatterns: ['*.md'],
  overrides: [
    {
      files: ['layouts/**/*.{js,ts,vue}'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
  ],
}
