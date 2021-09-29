
const urlBuilderBlockNumber = (value: string, chain: string, provider: string): any => {
	if (provider === 'subscan') {
		return `https://${chain}.${provider}.io/block/${value}`
	}

	if (provider === 'polkascan') {
		return `https://${provider}.io/pre/${chain}/block/${value}`
	}
}

const urlBuilderAccount = (value: string, chain: string, provider: string): any => {
	if (provider === 'subscan') {
		return `https://${chain}.${provider}.io/account/${value}`
	}

	if (provider === 'polkascan') {
		return `https://${provider}.io/pre/${chain}/account/${value}`
	}
}

const urlBuilderTransaction = (value: string, chain: string, provider: string): any => {
	if (provider === 'subscan') {
		return `https://${chain}.${provider}.io/extrinsic/${value}`
	}

	if (provider === 'polkascan') {
		return `https://${provider}.io/pre/${chain}/transaction/${value}`
	}
}

export { urlBuilderAccount, urlBuilderBlockNumber, urlBuilderTransaction }
