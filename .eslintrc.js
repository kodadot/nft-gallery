module.exports = {
	'env': {
		'browser': true,
		'es2020': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:vue/essential',
		'plugin:@typescript-eslint/recommended'
	],
	'parserOptions': {
		'ecmaVersion': 11,
		'parser': '@typescript-eslint/parser',
		'sourceType': 'module'
	},
	'plugins': [
		'vue',
		'prettier',
		'@typescript-eslint'
	],
	'rules': {
		'no-trailing-spaces': 'error',
		'no-var': 'error',
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'max-classes-per-file': [
			'error', 2
		],
	}
}
