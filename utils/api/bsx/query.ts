import type { ApiPromise } from '@polkadot/api'
import type { Option, u32 } from '@polkadot/types'
import type { Codec } from '@polkadot/types/types'
import type { PalletBalancesAccountData } from '@polkadot/types/lookup'
import { chainPropListOf } from '~/utils/config/chain.config'
import { unwrapOrDefault } from '../format'
import Query from '../Query'
import { AssetRegistryMetadata } from './types'

export function getAssetIdOf(api: ApiPromise, symbol: string): Promise<string> {
  return api.query.assetRegistry.assetIds(symbol).then((val) => val.toString())
}

export function getAssetMetadataById(
  api: ApiPromise,
  id: string
): Promise<AssetRegistryMetadata> {
  if (id === '0') {
    const { tokenDecimals, tokenSymbol } = chainPropListOf('bsx')
    return Promise.resolve({ symbol: tokenSymbol, decimals: tokenDecimals })
  }
  return api.query.assetRegistry
    .assetMetadataMap(id)
    .then((val) => unwrapOrDefault(val as Option<Codec>))
    .then((val) => val.toJSON() as AssetRegistryMetadata)
}

export function getAssetIdByAccount(
  api: ApiPromise,
  account: string
): Promise<string> {
  return api.query.multiTransactionPayment
    .accountCurrencyMap(account)
    .then((val) => unwrapOrDefault(val as Option<u32>))
    .then((val) => val.toString())
}

export function getAssetMetadataByAccount(
  api: ApiPromise,
  account: string
): Promise<AssetRegistryMetadata> {
  return getAssetIdByAccount(api, account).then((id) =>
    getAssetMetadataById(api, id)
  )
}

export function getAsssetBalance(
  api: ApiPromise,
  account: string,
  id: string
): Promise<string> {
  if (!account) {
    return Promise.resolve('')
  }

  if (id === '0') {
    return Query.getTokenBalance(api, account)
  }

  if (api.query.tokens) {
    return api.query.tokens
      .accounts(account, id)
      .then((val) => (val as PalletBalancesAccountData).free.toString())
  }

  return Promise.resolve('')
}

export function getKusamaAssetId(prefix: string): string {
  if (prefix === 'snek') {
    return '5'
  }

  if (prefix === 'bsx') {
    return '1'
  }

  throw new Error('invalid prefix')
}
