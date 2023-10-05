export function createArgs(
  randomId: number,
  metadata: string,
): [number, { Marketplace: null }, string] {
  return [randomId, { Marketplace: null }, metadata]
}

export function createArgsForNftPallet(
  account: string,
  maxSupply?: number,
): [string, any] {
  const config = {
    settings: 0,
    maxSupply,
    mintSettings: {
      mintType: { Issuer: null },
      defaultItemSettings: 0,
    },
  }
  return [account, config]
}
