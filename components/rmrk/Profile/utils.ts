export const supportedExplorers: Record<string, string> = {
  rmrk: 'https://kusama.subscan.io/account/',
  statemine: 'https://statemine.statescan.io/account/'
}

export const hasExplorer = (prefix: string): boolean => {
  return supportedExplorers[prefix] !== undefined
}

export const getExplorer = (prefix: string, id: string) => {
  return supportedExplorers[prefix] + id
}
