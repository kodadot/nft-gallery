import keyring from '@polkadot/ui-keyring'
import { KeyringAccount } from '@/types'
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types'
import { Callback, ISubmittableResult } from '@polkadot/types/types'
import { getAddress } from '@/extension'
import { toDefaultAddress } from '@/utils/account'
import { DispatchError, Hash } from '@polkadot/types/interfaces'

export type ExecResult = UnsubscribeFn | string
export type Extrinsic = SubmittableExtrinsic<'promise'>
export type UnsubscribeFn = () => string;

export const execResultValue = (execResult: ExecResult): string => {
  if (typeof execResult === 'function') {
    return execResult()
  }

  return execResult
}

export const sign = async (account: KeyringAccount | string, password: string | null, callback: (...params: any) => SubmittableExtrinsic<'promise'>, params: any[]): Promise<SubmittableExtrinsic<'promise'>> => {
  const transfer = await callback(...params)
  const address = typeof account === 'string' ? account : account.address
  const injector = await getAddress(toDefaultAddress(address))

  const options = injector ? { signer: injector.signer } : undefined
  const signer: AddressOrPair = injector ? address : extractFromKeyring(address, password)

  return transfer.signAsync(signer, options)
}

export const send = async (tx: SubmittableExtrinsic<'promise'>, statusCb?: Callback<any>): Promise<ExecResult> => {
  const hasCallback = typeof statusCb === 'function'
  const hash = hasCallback ? await tx.send(statusCb) : await tx.send()
  return typeof hash === 'function' ? constructCallback(hash, tx.hash.toHex()) : hash.toHex()
}

const exec = async (account: KeyringAccount | string, password: string | null, callback: (...params: any) => SubmittableExtrinsic<'promise'>, params: any[], statusCb?: Callback<any>): Promise<ExecResult> => {
  const tx = await sign(account, password, callback, params)
  return send(tx, statusCb)
}

const extractFromKeyring = (address: string, password: string | null) => {
  const alicePair = keyring.getPair(address)
  if (password) {
    alicePair.decodePkcs8(password)
  }

  return alicePair
}

const constructCallback = (cb: () => void, result: string) => {
  return () => {
    cb()
    return result
  }
}


export const txCb = (onSuccess: (blockHash: Hash) => void, onError: (err: DispatchError) => void, onResult: (result: ISubmittableResult) => void = console.log) =>
  (result: ISubmittableResult) => {
    onResult(result)
    if (result.dispatchError) {
      console.warn('[EXEC] dispatchError', result)
      onError(result.dispatchError)
    }

    if (result.status.isFinalized) {
      console.log('[EXEC] Finalized', result)
      console.log(`[EXEC] blockHash ${result.status.asFinalized}`)
      onSuccess(result.status.asFinalized)
    }
  }

export const estimate = async (account: KeyringAccount | string, callback: (...params: any) => SubmittableExtrinsic<'promise'>, params: any[]): Promise<string> => {
  const transfer = await callback(...params)
  const address = typeof account === 'string' ? account : account.address
  const injector = await getAddress(toDefaultAddress(address))

  const info = await transfer.paymentInfo(address, injector ?  { signer: injector.signer } : {})
  return info.partialFee.toString()
}



export default exec
