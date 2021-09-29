// apollo.config.js
module.exports = {
	client: {
		service: {
			name: 'magick',
			// URL to the GraphQL API
			url: 'https://api.subquery.network/sq/vikiival/magick'
			// url: 'http://localhost:3000',
		},
		// Files processed by the extension
		includes: [
			'src/**/*.vue',
			'src/**/*.js',
		],
	},
}
