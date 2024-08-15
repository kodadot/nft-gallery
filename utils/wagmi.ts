import type { Prefix } from '@kodadot1/static'
import { base, immutableZkEvm, mantle } from 'viem/chains'
import { type Chain, createPublicClient, http } from 'viem'

export const CHAIN_ID_TO_PREFIX: Record<number, Prefix> = {
  8453: 'base',
  13371: 'imx',
  5000: 'mnt',
}

export const PREFIX_TO_CHAIN: Partial<Record<Prefix, Chain>> = {
  base: base,
  imx: immutableZkEvm,
  mnt: mantle,
}

export const viemClient = (prefix: Prefix) =>
  createPublicClient({
    chain: PREFIX_TO_CHAIN[prefix],
    transport: http(),
  })
