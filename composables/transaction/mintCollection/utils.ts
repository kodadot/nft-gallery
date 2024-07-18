import { chainAssetOf } from '@/utils/config/chain.config'

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

export const calculateFees = () => {
  const preferences = usePreferencesStore()
  const { urlPrefix } = usePrefix()
  const { symbol } = chainAssetOf(urlPrefix.value)

  return {
    enabledFees: preferences.getHasSupport,
    feeMultiplier: Number(preferences.getHasSupport),
    token: symbol,
  }
}
