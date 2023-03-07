import { getKSMUSD } from '@/utils/coingecko'
import { asBalanceTransfer } from '@kodadot1/sub-api'
import { pubKeyToAddress } from './account'
import correctFormat from './ss58Format'
import { Extrinsic } from './transactionExecutor'
import type { ApiPromise } from '@polkadot/api'

const BACKUP_PUBKEY =
  '0x9866ec0c1204773a4b95a1b374d838b5820f704a65deeaafb97f4ab96c351158' // payout bot
export const KODADOT_DAO = 'CykZSc3szpVd95PmmJ45wE4ez7Vj3xkhRFS9H4U1WdrkaFY'
const OFFSET_DAO = 'J9PSLHKjtJ9eEAX4xmCe8xNipRxNiYJTbnyfKXXRkhMmuq8'
const BASE_FEE = 0.5 // 50 cents
const PERCENT = 0.03 // percent / 100

export const round = (num: number): number =>
  Math.round((num + Number.EPSILON) * 100) / 100

export const cost = async (
  api: ApiPromise,
  fee: number = BASE_FEE
): Promise<number> => {
  const ksmPrice = await getKSMUSD()
  console.log('[SUPPORT] 💋💋💋', fee / ksmPrice, 'KSM')
  const decimals: number = getTokenDecimals(api)
  return Math.round((fee / ksmPrice) * 10 ** decimals)
}

export const supportTx = async (
  api: ApiPromise,
  multiplyWith = 1
): Promise<Extrinsic> => {
  return asBalanceTransfer(
    api,
    resolveSupportAddress(api),
    await cost(api, BASE_FEE * multiplyWith)
  )
}

export const feeTx = (api: ApiPromise, price: string): Extrinsic => {
  return asBalanceTransfer(api, resolveSupportAddress(api), price)
}

export const somePercentFromTX = (api: ApiPromise, price: number | string) => {
  const fee = Number(price) * PERCENT
  return asBalanceTransfer(api, resolveSupportAddress(api), fee)
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
    await cost(api, price)
  )
}

export const canSupport = async (
  api: ApiPromise,
  enabled: boolean,
  multiplyWith = 1
): Promise<[] | [Extrinsic]> => {
  return enabled ? [await supportTx(api, multiplyWith)] : []
}

export const canOffset = async (
  api: ApiPromise,
  enabled: boolean
): Promise<[] | [Extrinsic]> => {
  return canSupport(api, enabled, 2)
}
