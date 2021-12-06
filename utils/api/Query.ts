import type { ApiPromise } from '@polkadot/api';
import { AccountData } from '@polkadot/types/interfaces/balances'
import { hexToBn } from '@polkadot/util'
import { Codec } from '@polkadot/types/types'
import BN from 'bn.js'

class Query {
  static async getNonce(api: ApiPromise, address: string): Promise<BN> {
    const { nonce } = await api.query.system.account(address)
    return nonce.toBn()
  }

  static async getTokenBalance(
    api: ApiPromise,
    accountId: string,

  ): Promise<string> {
    const cb = api.query.system.account
    const arg = accountId
    const balance = await cb(arg)
    const accountData = (balance as any).data.free.toString()
    return accountData
  }

}

export default Query
