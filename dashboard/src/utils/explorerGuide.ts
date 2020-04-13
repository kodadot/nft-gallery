
const urlBuilderBlockNumber = (value: string, chain: string, provider: string): any => {
  if (provider === 'subscan') {
    return `https://${chain}.${provider}.io/block/${value}`
  }

  if (provider === 'polkascan') {
    return `https://${provider}.io/pre/${chain}/block/${value}`
  }  
}

const providerDomain = (provider: string, chain: string) => {
  const map = {
    polkascan: { domain: 'polkascan.io/' },
    subscan: { domain: 'subscan.io/',}
  }

  switch (provider) {
    case 'polkascan':
      return `${map.polkascan.domain}`
      break;
    
    case 'subscan':
      return `${map.subscan.domain}`
    default:
      break;
  }
}

export default urlBuilderBlockNumber
