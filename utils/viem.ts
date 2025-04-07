import type { Prefix } from '@kodadot1/static'
import { base } from '@wagmi/vue/chains'
import { type Chain } from 'viem'

export const CHAIN_ID_TO_PREFIX: Record<number, Prefix> = {
  [base.id]: 'base',
}

export const PREFIX_TO_CHAIN: Partial<Record<Prefix, Chain>> = {
  base: base,
}
