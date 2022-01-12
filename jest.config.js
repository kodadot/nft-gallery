module.exports = {
  preset: '@nuxt/test-utils',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@vue-polkadot|@polkadot|@babel/runtime/helpers/esm/)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
  moduleFileExtensions: [
    'ts', // if using TypeScript
    'js',
    'vue',
    'json'
  ],
}
