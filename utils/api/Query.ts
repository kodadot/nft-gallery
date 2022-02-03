import type { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'
import correctFormat from '../ss58Format'

type ChainProperties = {
  ss58Format: number
  tokenDecimals: number
  tokenSymbol: string
}

class Query {
  static async getNonce(api: ApiPromise, address: string): Promise<BN> {
    const { nonce } = await api.query.system.account(address)
    return nonce.toBn()
  }

  static async getTokenBalance(
    api: ApiPromise,
    accountId: string
  ): Promise<string> {
    const cb = api.query.system.account
    const arg = accountId
    const balance = await cb(arg)
    const accountData = (balance as any).data.free.toString()
    return accountData
  }

  static getChainProperties(api: ApiPromise): ChainProperties {
    const { chainSS58, chainDecimals, chainTokens } = api.registry
    return {
      ss58Format: correctFormat(chainSS58),
      tokenDecimals: chainDecimals[0] || 12,
      tokenSymbol: chainTokens[0] || 'Unit',
    }
  }
}

export default Query
