import keyring from '@polkadot/ui-keyring'
import type { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types'
import type { Callback, ISubmittableResult } from '@polkadot/types/types'
import type { DispatchError, Hash } from '@polkadot/types/interfaces'
import { Interaction } from '@kodadot1/minimark/v1'
import { estimateGas, getGasPrice } from '@wagmi/core'
import type { Address } from 'viem'
import { encodeFunctionData } from 'viem'
import type { Prefix } from '@kodadot1/static'
import { calculateBalance } from './format/balance'
import type { KeyringAccount } from '@/utils/types/types'
import { getAddress } from '@/utils/extension'
import { toDefaultAddress } from '@/utils/account'
import { KODADOT_DAO } from '@/utils/support'
import type { Actions, ActionsInteractions, ExecuteEvmTransactionParams } from '@/composables/transaction/types'

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

    if (!injector) {
      throw new Error('Oops! We can\'t find your wallet, please log in again.')
    }

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
  }
  catch (err) {
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

export type TxCbOnSuccessParams = { blockHash: Hash, txHash: Hash }

export const txCb
  = (
    onSuccess: (prams: TxCbOnSuccessParams) => void,
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
        onSuccess({ blockHash: result.status.asFinalized, txHash: result.txHash })
      }
    }

export const estimate = async (
  account: KeyringAccount | string,
  callback: (...params: any) => SubmittableExtrinsic<'promise'>,
  params: any[],
): Promise<string> => {
  const transfer = await callback(...params)
  const address
    = typeof account === 'string' ? account ?? KODADOT_DAO : account.address
  // if user have not connect wallet, we provide a mock address to estimate fee
  const injector = await getAddress(toDefaultAddress(address))

  const info = await transfer.paymentInfo(
    address,
    injector ? { signer: injector.signer } : {},
  )
  return info.partialFee.toString()
}

const estimateEvm = async ({ arg, abi, functionName, account, prefix, address }: ExecuteEvmTransactionParams & { account: string, prefix: Prefix }) => {
  const { $wagmiConfig } = useNuxtApp()

  const [estimatedGas, gasPrice] = await Promise.all([
    estimateGas($wagmiConfig, {
      account: account as Address,
      to: address as Address,
      data: encodeFunctionData({
        abi,
        args: arg,
        functionName,
      }),
      chainId: PREFIX_TO_CHAIN[prefix]?.id,
    }),
    getGasPrice($wagmiConfig),
  ])

  return String(estimatedGas * gasPrice)
}

const preProcessedAction: Partial<Record<ActionsInteractions, (params: { action: Actions, account: string }) => Actions>> = {
  [Interaction.SEND]: ({ action, account }) => ({ ...action, address: account }),
}

export const getActionTransactionFee = async ({
  action,
  address: account,
  prefix,
}: {
  action: Actions
  address: string
  prefix: Prefix
}): Promise<string> => {
  // Keep in mind atm actions with ipfs file will be uploadeed
  if ([Interaction.MINT, Interaction.MINTNFT].includes(action.interaction)) {
    console.log('[ACTION FEE]: Fee not allowed', action.interaction)
    return '0'
  }

  const api = await execByVm({
    SUB: () => {
      const { apiInstanceByPrefix } = useApi()
      return apiInstanceByPrefix(prefix)
    },
  }, { prefix })

  return new Promise((resolve, reject) => {
    const item = preProcessedAction[action.interaction]?.({ action, account }) || action

    executeAction({
      api,
      item,
      executeTransaction: async (params) => {
        try {
          const fee = await execByVm({
            SUB: () => estimate(account, params.cb, params.arg),
            EVM: () => estimateEvm({ account, ...params, prefix }),
          }, { prefix }) as string

          resolve(fee)
        }
        catch (error) {
          reject(error)
        }
      },
      isLoading: ref(false),
      status: ref(''),
    })
  })
}

export const estimateTransactionFee = (account: string, decimals: number): Promise<string> => getTransitionFee(account, [''], decimals)

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
  const cb = isSingle
    ? api.tx.balances.transferAllowDeath
    : api.tx.utility.batch
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

          return api.tx.balances.transferAllowDeath(
            target.address,
            amountToTransfer,
          )
        }),
      ]
  return { cb, arg }
}

export default exec
