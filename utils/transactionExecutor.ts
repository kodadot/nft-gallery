import keyring from '@polkadot/ui-keyring'
import { KeyringAccount } from '@/utils/types/types'
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types'
import { Callback, ISubmittableResult } from '@polkadot/types/types'
import { getAddress } from '@/utils/extension'
import { toDefaultAddress } from '@/utils/account'
import { DispatchError, Hash } from '@polkadot/types/interfaces'
import { KODADOT_DAO } from '@/utils/support'
import { calculateBalance } from './format/balance'
import type { Actions } from '@/composables/transaction/types'
import { ApiPromise } from '@polkadot/api'
import { Interaction } from '@kodadot1/minimark/v1'

export type ExecResult = UnsubscribeFn | string
export type Extrinsic = SubmittableExtrinsic<'promise'>
export type UnsubscribeFn = () => string

export const execResultValue = (execResult: ExecResult): string => {
  if (typeof execResult === 'function') {
    return execResult()
  }

  return execResult
}

const exec = async (
  account: KeyringAccount | string,
  password: string | null,
  callback: (...params: any[]) => SubmittableExtrinsic<'promise'>,
  params: any[],
  statusCb: Callback<any>,
): Promise<ExecResult> => {
  try {
    const transfer = await callback(...params)
    const address = typeof account === 'string' ? account : account.address
    const injector = await getAddress(toDefaultAddress(address))
    const hasCallback = typeof statusCb === 'function'

    const options = injector ? { signer: injector.signer } : undefined
    const signer: AddressOrPair = injector
      ? address
      : extractFromKeyring(address, password)

    const tx = await transfer.signAsync(signer, options)
    const hash = await getHash(hasCallback, tx, transfer, statusCb)
    return typeof hash === 'function'
      ? constructCallback(hash, tx.hash.toHex())
      : hash.toHex()
  } catch (err) {
    console.warn(err)
    throw err
  }
}

const getHash = async (hasCallback, tx, transfer, statusCb) => {
  return hasCallback ? await tx.send(statusCb) : await transfer.send()
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

export const txCb =
  (
    onSuccess: (blockHash: Hash) => void,
    onError: (err: DispatchError) => void,
    onResult: (result: ISubmittableResult) => void = console.log,
  ) =>
  (result: ISubmittableResult): void => {
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

export const estimate = async (
  account: KeyringAccount | string,
  callback: (...params: any) => SubmittableExtrinsic<'promise'>,
  params: any[],
): Promise<string> => {
  const transfer = await callback(...params)
  const address =
    typeof account === 'string' ? account ?? KODADOT_DAO : account.address
  // if user have not connect wallet, we provide a mock address to estimate fee
  const injector = await getAddress(toDefaultAddress(address))

  const info = await transfer.paymentInfo(
    address,
    injector ? { signer: injector.signer } : {},
  )
  return info.partialFee.toString()
}

export const getActionTransactionFee = ({
  action,
  address,
  api,
}: {
  action: Actions
  api: ApiPromise
  address: string
}) => {
  return new Promise((resolve, reject) => {
    // Keep in mind atm actions with ipfs file will be uploadeed
    if ([Interaction.MINT, Interaction.MINTNFT].includes(action.interaction)) {
      console.log('[ACTION FEE]: Fee not allowed', action.interaction)
      return resolve('0')
    }

    executeAction({
      api,
      item: action,
      executeTransaction: async ({ cb, arg }) => {
        try {
          const fee = await estimate(address, cb, arg)
          resolve(fee)
        } catch (error) {
          reject(error)
        }
      },
      isLoading: ref(false),
      status: ref(''),
    })
  })
}

export const getTransitionFee = async (
  accountId: string,
  targetAddresses: Array<string>,
  decimal: number,
) => {
  const { cb, arg } = await getTransferParams(
    targetAddresses.map(
      () =>
        ({
          address: toDefaultAddress(KODADOT_DAO),
          usd: 1,
          token: 1,
        }) as TargetAddress,
    ),
    decimal,
  )
  return estimate(accountId, cb, arg)
}
export type TargetAddress = {
  address: string
  usd?: number | string
  token?: number | string
  isInvalid?: boolean
}
const getTransferParams = async (
  addresses: TargetAddress[],
  decimals: number,
) => {
  const { apiInstance } = useApi()

  const api = await apiInstance.value
  const isSingle = addresses.length === 1
  const firstAddress = addresses[0]
  const cb = isSingle ? api.tx.balances.transfer : api.tx.utility.batch
  const arg = isSingle
    ? [
        firstAddress.address,
        String(calculateBalance(firstAddress.token as number, decimals)),
      ]
    : [
        addresses.map((target) => {
          const amountToTransfer = String(
            calculateBalance(target.token as number, decimals),
          )

          return api.tx.balances.transfer(target.address, amountToTransfer)
        }),
      ]
  return { cb, arg }
}

export default exec
