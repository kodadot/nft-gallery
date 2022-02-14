module.exports = {
  preset: '@nuxt/test-utils',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  testMatch: ['**/?(*.)+(spec).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@kodadot1|@polkadot|@babel/runtime/helpers/esm/)',
  ],
  testPathIgnorePatterns: ['<rootDir>/tests/cypress/'],
  moduleFileExtensions: [
    'ts', // if using TypeScript
    'js',
    'vue',
    'json',
  ],
  collectCoverage: false,
}
