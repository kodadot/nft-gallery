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
    '/node_modules/(?!@vue-polkadot|@polkadot|@babel/runtime/helpers/esm/)',
  ],
  moduleFileExtensions: [
    'ts', // if using TypeScript
    'js',
    'vue',
    'json',
  ],
  collectCoverage: false,
};
