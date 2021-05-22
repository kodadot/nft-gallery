// apollo.config.js
module.exports = {
  client: {
    service: {
      name: 'subquery',
      // URL to the GraphQL API
      url: 'http://localhost:3000',
    },
    // Files processed by the extension
    includes: [
      'src/**/*.vue',
      'src/**/*.js',
    ],
  },
}
