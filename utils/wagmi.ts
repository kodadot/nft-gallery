import type { Prefix } from '@kodadot1/static'
import { base, immutableZkEvm } from 'viem/chains'
import { type Chain } from 'viem'

export const CHAIN_ID_TO_PREFIX: Record<number, Prefix> = {
  8453: 'base',
  13371: 'imx',
}

export const PREFIX_TO_CHAIN: Partial<Record<Prefix, Chain>> = {
  base: base,
  imx: immutableZkEvm,
}
