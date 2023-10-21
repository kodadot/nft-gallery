export const assetHub = ['ahk', 'ahp']

export const chainNameSeoMap = {
  ahk: 'Kusama',
  ahp: 'Polkadot',
}

export const getSeoPrefixName = (prefix) => {
  return chainNameSeoMap[prefix]
}
