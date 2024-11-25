// Copyright 2017-2021 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Prefix } from '@kodadot1/static'
import * as paraspell from '@paraspell/sdk'
import { ApiFactory } from '@kodadot1/sub-api'
import { getChainEndpointByPrefix } from '@/utils/chain'
import type { TeleportParams } from '@/composables/useTeleport'
import { getAddress } from '@/utils/extension'
import { toDefaultAddress } from '@/utils/account'

export enum Chain {
  KUSAMA = 'Kusama',
  ASSETHUBKUSAMA = 'AssetHubKusama',
  ASSETHUBPOLKADOT = 'AssetHubPolkadot',
  POLKADOT = 'Polkadot',
  BASE = 'Base',
  IMMUTABLEX = 'Immutable',
  MANTLE = 'Mantle',
}

export type TeleportChain = {
  prefix: Prefix
  chain: Chain
  name: string
}

export type TeleportTransition = {
  source: TeleportChain | null
  destination: TeleportChain
  amount: number
  amountFormatted: string
  amountUsd: string
  token: string
  txFees: number
}

export const allowedTransitions = {
  [Chain.KUSAMA]: [Chain.ASSETHUBKUSAMA],
  [Chain.ASSETHUBKUSAMA]: [Chain.KUSAMA],
  [Chain.POLKADOT]: [Chain.ASSETHUBPOLKADOT],
  [Chain.ASSETHUBPOLKADOT]: [Chain.POLKADOT],
}

export const chainToPrefixMap: Record<Chain, Prefix> = {
  [Chain.KUSAMA]: 'ksm',
  [Chain.ASSETHUBKUSAMA]: 'ahk',
  [Chain.ASSETHUBPOLKADOT]: 'ahp',
  [Chain.POLKADOT]: 'dot',
  [Chain.BASE]: 'base',
  [Chain.IMMUTABLEX]: 'imx',
  [Chain.MANTLE]: 'mnt',
}

export const prefixToChainMap: Partial<Record<Prefix, Chain>> = {
  ksm: Chain.KUSAMA,
  ahk: Chain.ASSETHUBKUSAMA,
  ahp: Chain.ASSETHUBPOLKADOT,
  dot: Chain.POLKADOT,
  imx: Chain.IMMUTABLEX,
  base: Chain.BASE,
  mnt: Chain.MANTLE,
}

export enum TeleprtType {
  RelayToPara = 'RelayToPara',
  ParaToRelay = 'ParaToRelay',
  ParaToPara = 'ParaToPara',
}

export const whichTeleportType = ({
  from,
  to,
}: {
  from: Chain
  to: Chain
}): TeleprtType => {
  switch (from) {
    case Chain.KUSAMA:
    case Chain.POLKADOT:
      return TeleprtType.RelayToPara

    case Chain.ASSETHUBKUSAMA:
    case Chain.ASSETHUBPOLKADOT:
      return [Chain.KUSAMA, Chain.POLKADOT].includes(to)
        ? TeleprtType.ParaToRelay
        : TeleprtType.ParaToPara

    default:
      throw new Error(`Unknown chain: ${from}`)
  }
}

const getApi = (chain: Chain) => {
  const endpoint = getChainEndpointByPrefix(chainToPrefixMap[chain]) as string
  return ApiFactory.useApiInstance(endpoint)
}

export const getTransaction = async ({
  amount,
  from,
  to,
  address,
  currency,
}: {
  amount: number
  from: Chain
  to: Chain
  address: string
  currency: string
}) => {
  const api = await getApi(from)

  const telportType = whichTeleportType({
    from: from,
    to: to,
  })

  if (telportType === TeleprtType.RelayToPara) {
    return paraspell
      .Builder(api)
      .to(Chain[to.toUpperCase()])
      .amount(amount)
      .address(address)
      .build()
  }

  if (telportType === TeleprtType.ParaToRelay) {
    return paraspell
      .Builder(api)
      .from(Chain[from.toUpperCase()])
      .amount(amount)
      .address(address)
      .build()
  }

  if (telportType === TeleprtType.ParaToPara) {
    return paraspell
      .Builder(api)
      .from(Chain[from.toUpperCase()])
      .to(Chain[to.toUpperCase()])
      .currency(currency)
      .amount(amount)
      .address(address)
      .build()
  }
}

export const getTransactionFee = async ({
  amount,
  from,
  to,
  toAddress,
  fromAddress,
  currency,
}: TeleportParams) => {
  const promise = await getTransaction({
    amount: amount,
    from: from,
    to: to,
    address: toAddress,
    currency: currency,
  })

  if (!promise) {
    return
  }

  const injector = await getAddress(toDefaultAddress(fromAddress))

  const info = await promise.paymentInfo(
    fromAddress,
    injector ? { signer: injector.signer } : {},
  )

  return info.partialFee.toString()
}

export type Currency = 'KSM' | 'DOT' | 'ETH' | 'MNT'

export const getChainCurrency = (chain: Chain): Currency => {
  switch (chain) {
    case Chain.KUSAMA:
    case Chain.ASSETHUBKUSAMA:
      return 'KSM'
    case Chain.POLKADOT:
    case Chain.ASSETHUBPOLKADOT:
      return 'DOT'
    case Chain.BASE:
    case Chain.IMMUTABLEX:
      return 'ETH'
    case Chain.MANTLE:
      return 'MNT'
  }
}

export const chainToPrecisionMap: Record<Chain, number> = {
  [Chain.KUSAMA]: 4,
  [Chain.ASSETHUBKUSAMA]: 6,
  [Chain.ASSETHUBPOLKADOT]: 5,
  [Chain.BASE]: 5,
  [Chain.MANTLE]: 5,
  [Chain.IMMUTABLEX]: 5,
  [Chain.POLKADOT]: 4,
}
