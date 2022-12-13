export const supportedExplorers: Record<string, string> = {
  rmrk: 'https://kusama.subscan.io/account/',
  statemine: 'https://statemine.statescan.io/account/',
  bsx: 'https://basilisk.subscan.io/account/',
  snek: 'https://calamar.play.hydration.cloud/rococo%20basilisk/search?query=',
  movr: 'https://moonriver.subscan.io/account/',
  glmr: 'https://moonbeam.subscan.io/account/',
}

export const hasExplorer = (prefix: string): boolean => {
  return supportedExplorers[prefix] !== undefined
}

export const getExplorer = (prefix: string, id: string) => {
  return supportedExplorers[prefix] + id
}
