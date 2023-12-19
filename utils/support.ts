import { asBalanceTransfer } from '@kodadot1/sub-api'
import { pubKeyToAddress } from './account'
import correctFormat from './ss58Format'
import { Extrinsic } from './transactionExecutor'
import type { ApiPromise } from '@polkadot/api'
import { Royalty } from './royalty'

const BACKUP_PUBKEY =
  '0x9866ec0c1204773a4b95a1b374d838b5820f704a65deeaafb97f4ab96c351158' // payout bot
export const KODADOT_DAO = 'CykZSc3szpVd95PmmJ45wE4ez7Vj3xkhRFS9H4U1WdrkaFY'
export const KODA_BOT = 'Gn84LKb5HSxc3SACayxCzKQcWESRMcT1VUCqeZURfGj6ASi'
const OFFSET_DAO = 'J9PSLHKjtJ9eEAX4xmCe8xNipRxNiYJTbnyfKXXRkhMmuq8'
export const BASE_FEE = 0.5 // 50 cents
export const SUPPORT_FEE_PERCENT = 0.03 // percent / 100

export const round = (num: number): number =>
  Math.round((num + Number.EPSILON) * 100) / 100

export type SupportTokens = 'KSM' | 'DOT'

export const cost = async (
  api: ApiPromise,
  fee: number = BASE_FEE,
  token?: SupportTokens = 'KSM',
): Promise<number> => {
  const tokenPrice = await getApproximatePriceOf(token)

  if (tokenPrice === 0) {
    return 0
  }

  console.log('[SUPPORT] 💋💋💋', fee / tokenPrice, token)
  const decimals: number = getTokenDecimals(api)
  return Math.round((fee / tokenPrice) * 10 ** decimals)
}

export const supportTx = async (
  api: ApiPromise,
  multiplyWith = 1,
  token?: SupportTokens = 'KSM',
): Promise<Extrinsic> => {
  return asBalanceTransfer(
    api,
    resolveSupportAddress(api),
    await cost(api, BASE_FEE * multiplyWith, token),
  )
}

export const feeTx = (api: ApiPromise, price: string): Extrinsic => {
  return asBalanceTransfer(api, resolveSupportAddress(api), price)
}

export const getPercentSupportFee = (price: number | string) => {
  // it has to be an integer
  return Math.floor(Number(price) * SUPPORT_FEE_PERCENT)
}

export const somePercentFromTX = (api: ApiPromise, price: number | string) => {
  const fee = getPercentSupportFee(price)
  return asBalanceTransfer(api, resolveSupportAddress(api), fee)
}

export const royaltyFee = (price: string | number, royaltyPercent: number) =>
  // it has to be an integer
  Math.floor(Number(price) * (royaltyPercent / 100))

export const payRoyaltyTx = (
  api: ApiPromise,
  price: number | string,
  royalty: Royalty,
) => {
  const fee = royaltyFee(price, royalty.amount)
  return asBalanceTransfer(api, royalty.address, fee)
}

const getTokenDecimals = (api: ApiPromise): number => {
  const { chainDecimals } = api.registry
  return chainDecimals[0] || 12
}

const getSS58Format = (api: ApiPromise): number => {
  const { chainSS58 } = api.registry
  return correctFormat(chainSS58)
}

export const resolveSupportAddress = (api: ApiPromise) => {
  const ss58Format = getSS58Format(api)
  console.log('[SUPPORT] ss58Format', ss58Format)
  return Number(ss58Format) === 2 ? KODADOT_DAO : pubKeyToAddress(BACKUP_PUBKEY)
}

export const resolveOffsetAddress = (api: ApiPromise) => {
  const ss58Format = getSS58Format(api)
  return Number(ss58Format) === 2 ? OFFSET_DAO : pubKeyToAddress(BACKUP_PUBKEY)
}

export const offsetTx = async (api: ApiPromise, price: number) => {
  return api.tx.balances.transfer(
    resolveSupportAddress(api),
    await cost(api, price),
  )
}

export const canSupport = async (
  api: ApiPromise,
  enabled: boolean,
  multiplyWith = 1,
  token: SupportTokens = 'KSM',
): Promise<[] | [Extrinsic]> => {
  return enabled ? [await supportTx(api, multiplyWith, token)] : []
}

export const canOffset = async (
  api: ApiPromise,
  enabled: boolean,
  token: SupportTokens,
): Promise<[] | [Extrinsic]> => {
  return canSupport(api, enabled, 2, token)
}
