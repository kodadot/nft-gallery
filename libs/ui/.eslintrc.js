module.exports = {
  extends: ['plugin:vue/recommended'],
  rules: {
    // override/add rules settings here, such as:
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
    'linebreak-style': 0,
    quotes: ['error', 'single'],
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
  },
}
