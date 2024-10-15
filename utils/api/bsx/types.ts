import type { SubmittableExtrinsicFunction } from '@polkadot/api/types'
import type { AnyTuple } from '@polkadot/types/types'

export type AssetRegistryMetadata = {
  symbol: string
  decimals: number
}

export type ExtrinsicCall = {
  call: SubmittableExtrinsicFunction<'promise', AnyTuple>
  args: []
}
