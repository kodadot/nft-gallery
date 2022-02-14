import { getKSMUSD } from '@/utils/coingecko'
import Connector from '@kodadot1/sub-api'
import * as store from '~/store'
import { pubKeyToAddress } from './account'
import correctFormat from './ss58Format'
import { Extrinsic } from './transactionExecutor'

const BACKUP_PUBKEY =
  '0x9866ec0c1204773a4b95a1b374d838b5820f704a65deeaafb97f4ab96c351158' // payout bot
const KODADOT_DAO = 'CykZSc3szpVd95PmmJ45wE4ez7Vj3xkhRFS9H4U1WdrkaFY'
const OFFSET_DAO = 'J9PSLHKjtJ9eEAX4xmCe8xNipRxNiYJTbnyfKXXRkhMmuq8'
const BASE_FEE = 0.5 // 50 cents
const PERCENT = 0.03 // percent / 100

export const round = (num: number): number =>
  Math.round((num + Number.EPSILON) * 100) / 100

export const cost = async (fee: number = BASE_FEE): Promise<number> => {
  const ksmPrice = await getKSMUSD()
  console.log('[SUPPORT] 💋💋💋', fee / ksmPrice, 'KSM')
  const decimals: number = getTokenDecimals()
  return Math.round((fee / ksmPrice) * 10 ** decimals)
}

export const supportTx = async (multiplyWith = 1): Promise<Extrinsic> => {
  const { api } = Connector.getInstance()
  return api.tx.balances.transfer(
    resolveSupportAddress(),
    await cost(BASE_FEE * multiplyWith)
  )
}

export const feeTx = (price: string): Extrinsic => {
  const { api } = Connector.getInstance()
  return api.tx.balances.transfer(resolveSupportAddress(), price)
}

export const somePercentFromTX = (price: number | string) => {
  const { api } = Connector.getInstance()
  const fee = Number(price) * PERCENT
  return api.tx.balances.transfer(resolveSupportAddress(), fee)
}

// DEV: so thing is that store.getters['chain/getChainProperties58Format'] is no longer available
//     so we need to use the chainSS58 from the api
//

const getTokenDecimals = (): number => {
  const { api } = Connector.getInstance()
  const { chainDecimals } = api.registry
  return chainDecimals[0] || 12
}

const getSS58Format = (): number => {
  const { api } = Connector.getInstance()
  const { chainSS58 } = api.registry
  return correctFormat(chainSS58)
}

export const resolveSupportAddress = () => {
  const ss58Format = getSS58Format()
  console.log('[SUPPORT] ss58Format', ss58Format)
  return Number(ss58Format) === 2 ? KODADOT_DAO : pubKeyToAddress(BACKUP_PUBKEY)
}

export const resolveOffsetAddress = () => {
  const ss58Format = getSS58Format()
  return Number(ss58Format) === 2 ? OFFSET_DAO : pubKeyToAddress(BACKUP_PUBKEY)
}

export const offsetTx = async (price: number) => {
  const { api } = Connector.getInstance()
  return api.tx.balances.transfer(resolveSupportAddress(), await cost(price))
}

export const canSupport = async (
  enabled: boolean,
  multiplyWith = 1
): Promise<[] | [Extrinsic]> => {
  return enabled ? [await supportTx(multiplyWith)] : []
}

export const canOffset = async (
  enabled: boolean
): Promise<[] | [Extrinsic]> => {
  return canSupport(enabled, 2)
}
